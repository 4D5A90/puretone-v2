import type { Exercise, MuscleGroup } from "./ExerciseDatabase";
import type { FocusLevel } from "../../services/WorkoutService";

export interface WorkoutPlan {
	id: string;
	name: string;
	exercises: WorkoutExercise[];
	focus: FocusLevel;
}

export interface WorkoutExercise {
	exercise: Exercise;
	sets: number;
	reps: string;
	rest: number;
}

export type SplitType = "ppl" | "upper_lower" | "full_body" | "custom";

export interface WorkoutSchedule {
	id: string;
	splitType: SplitType;
	days: WorkoutPlan[];
}

const VOLUME_GUIDELINES = {
	high: { min: 12, max: 16 },
	medium: { min: 6, max: 12 },
	low: { min: 3, max: 5 },
};

// Split muscle groups by type
export const PUSH_MUSCLES: MuscleGroup[] = ["chest", "shoulders", "triceps"];
export const PULL_MUSCLES: MuscleGroup[] = ["back", "biceps"];
export const LEG_MUSCLES: MuscleGroup[] = [
	"quads",
	"hamstrings",
	"calves",
	"glutes",
	"adductors",
];
export const UPPER_MUSCLES: MuscleGroup[] = [
	"chest",
	"back",
	"shoulders",
	"biceps",
	"triceps",
];
export const LOWER_MUSCLES: MuscleGroup[] = [
	"quads",
	"hamstrings",
	"calves",
	"glutes",
	"adductors",
];

export const generateWorkout = async (
	muscleFocus: Partial<Record<MuscleGroup, FocusLevel>>,
	allExercises: Exercise[],
	repRanges?: {
		compound?: { min: number; max: number };
		isolation?: { min: number; max: number };
	},
	excludedExerciseIds: string[] = [],
): Promise<WorkoutPlan> => {
	const plan: WorkoutExercise[] = [];

	// Priority: High -> Medium -> Low
	const priorityOrder: Record<FocusLevel, number> = {
		high: 3,
		medium: 2,
		low: 1,
	};
	const targetMuscles = (Object.keys(muscleFocus) as MuscleGroup[]).sort(
		(a, b) => {
			const focusA = muscleFocus[a] || "medium";
			const focusB = muscleFocus[b] || "medium";
			return priorityOrder[focusB] - priorityOrder[focusA];
		},
	);

	// Default rep ranges if not provided
	const compoundReps = repRanges?.compound
		? `${repRanges.compound.min}-${repRanges.compound.max}`
		: "6-10";
	const isolationReps = repRanges?.isolation
		? `${repRanges.isolation.min}-${repRanges.isolation.max}`
		: "8-12";

	// Filter out excluded exercises initially
	const availableExercises = allExercises.filter(
		(e) => !excludedExerciseIds.includes(e.id),
	);

	for (const muscle of targetMuscles) {
		const focusLevel = muscleFocus[muscle] || "medium";
		const volume = VOLUME_GUIDELINES[focusLevel];

		// Get exercises for this muscle
		const muscleExercises = availableExercises.filter((e) =>
			e.targetMuscles.includes(muscle),
		);

		// Sort by compound first
		const compounds = muscleExercises.filter((e) => e.type === "compound");
		const isolations = muscleExercises.filter((e) => e.type === "isolation");

		let currentSets = 0;

		// Strategy: Fill volume with compounds first, then isolations
		// For high focus, we want more variety

		// 1. Main Compound
		if (compounds.length > 0) {
			const selected = compounds[Math.floor(Math.random() * compounds.length)];
			const sets = Math.min(4, volume.min); // Start with up to 4 sets
			plan.push({
				exercise: selected,
				sets: sets,
				reps: compoundReps,
				rest: 120,
			});
			currentSets += sets;

			// Remove selected to avoid duplicate (simple approach)
			// In a real app we'd track used IDs
		}

		// 2. Secondary Compound (if high volume needed and available)
		if (
			currentSets < volume.min &&
			compounds.length > 1 &&
			focusLevel === "high"
		) {
			const remainingCompounds = compounds.filter(
				(c) => !plan.some((p) => p.exercise.id === c.id),
			);
			if (remainingCompounds.length > 0) {
				const selected =
					remainingCompounds[
						Math.floor(Math.random() * remainingCompounds.length)
					];
				const sets = Math.min(3, volume.min - currentSets);
				plan.push({
					exercise: selected,
					sets: sets,
					reps: compoundReps,
					rest: 120,
				});
				currentSets += sets;
			}
		}

		// 3. Fill remaining with Isolations
		while (currentSets < volume.min && isolations.length > 0) {
			const remainingIsolations = isolations.filter(
				(i) => !plan.some((p) => p.exercise.id === i.id),
			);
			if (remainingIsolations.length === 0) break; // No more unique isolations

			const selected =
				remainingIsolations[
					Math.floor(Math.random() * remainingIsolations.length)
				];
			const sets = Math.min(3, volume.min - currentSets);

			if (sets > 0) {
				plan.push({
					exercise: selected,
					sets: sets,
					reps: isolationReps,
					rest: 90,
				});
				currentSets += sets;
			} else {
				break;
			}
		}

		// If still not enough volume (e.g. lack of exercises), we might need to increase sets on existing exercises
		// But for now, we accept best effort.
	}

	return {
		id: crypto.randomUUID(),
		name: "Custom Workout",
		exercises: plan,
		focus: "medium",
	};
};

export const generateSchedule = async (
	splitType: SplitType,
	daysPerWeek: number,
	allExercises: Exercise[],
	customMuscleFocus?: Partial<Record<MuscleGroup, FocusLevel>>,
	multiDayFocus?: Array<Partial<Record<MuscleGroup, FocusLevel>>>,
	repRanges?: {
		compound?: { min: number; max: number };
		isolation?: { min: number; max: number };
	},
): Promise<WorkoutSchedule> => {
	const days: WorkoutPlan[] = [];

	if (splitType === "custom") {
		const usedExerciseIds = new Set<string>();

		if (multiDayFocus && multiDayFocus.length > 0) {
			// Multi-day custom - use per-day muscle focus
			for (let i = 0; i < multiDayFocus.length; i++) {
				const workout = await generateWorkout(
					multiDayFocus[i],
					allExercises,
					repRanges,
					Array.from(usedExerciseIds),
				);
				workout.name = `Custom Day ${i + 1}`;
				days.push(workout);

				// Track used exercises
				for (const e of workout.exercises) {
					usedExerciseIds.add(e.exercise.id);
				}
			}
		} else if (customMuscleFocus) {
			// Single day custom - repeat the same workout
			// Note: For single day repeated, we probably WANT repetition if it's the same workout performed multiple times a week?
			// Or does the user want 3 DIFFERENT workouts for the same focus?
			// "if there are 3 days then distribute exercises"
			// If I select "Chest High" and say 3 days/week, do I want 3 identical chest days or 3 variations?
			// Usually variations. Let's apply exclusion here too.

			for (let i = 0; i < daysPerWeek; i++) {
				const workout = await generateWorkout(
					customMuscleFocus,
					allExercises,
					repRanges,
					Array.from(usedExerciseIds),
				);
				workout.name = `Custom Workout ${i + 1}`;
				days.push(workout);

				for (const e of workout.exercises) {
					usedExerciseIds.add(e.exercise.id);
				}
			}
		}
	} else if (splitType === "ppl") {
		// Push/Pull/Legs split
		const pushFocus: Partial<Record<MuscleGroup, FocusLevel>> = {};
		for (const m of PUSH_MUSCLES) pushFocus[m] = "high";

		const pullFocus: Partial<Record<MuscleGroup, FocusLevel>> = {};
		for (const m of PULL_MUSCLES) pullFocus[m] = "high";

		const legFocus: Partial<Record<MuscleGroup, FocusLevel>> = {};
		for (const m of LEG_MUSCLES) legFocus[m] = "high";

		const push = await generateWorkout(pushFocus, allExercises);
		push.name = "Push Day";

		const pull = await generateWorkout(pullFocus, allExercises);
		pull.name = "Pull Day";

		const legs = await generateWorkout(legFocus, allExercises);
		legs.name = "Leg Day";

		// Repeat based on days per week
		if (daysPerWeek >= 6) {
			days.push(push, pull, legs, push, pull, legs);
		} else if (daysPerWeek >= 3) {
			days.push(push, pull, legs);
		}
	} else if (splitType === "upper_lower") {
		// Upper/Lower split
		const upperFocus: Partial<Record<MuscleGroup, FocusLevel>> = {};
		for (const m of UPPER_MUSCLES) upperFocus[m] = "medium";

		const lowerFocus: Partial<Record<MuscleGroup, FocusLevel>> = {};
		for (const m of LOWER_MUSCLES) lowerFocus[m] = "high";

		const upper = await generateWorkout(upperFocus, allExercises);
		upper.name = "Upper Body";

		const lower = await generateWorkout(lowerFocus, allExercises);
		lower.name = "Lower Body";

		// Repeat based on days per week
		if (daysPerWeek >= 4) {
			days.push(upper, lower, upper, lower);
		} else if (daysPerWeek >= 2) {
			days.push(upper, lower);
		}
	} else if (splitType === "full_body") {
		// Full body workout
		const fullBodyFocus: Partial<Record<MuscleGroup, FocusLevel>> = {
			chest: "medium",
			back: "medium",
			quads: "medium",
			shoulders: "low",
			biceps: "low",
			triceps: "low",
		};

		const fullBody = await generateWorkout(fullBodyFocus, allExercises);
		fullBody.name = "Full Body";

		// Repeat based on days per week
		for (let i = 0; i < Math.min(daysPerWeek, 3); i++) {
			days.push({ ...fullBody, id: crypto.randomUUID() });
		}
	}

	return {
		id: crypto.randomUUID(),
		splitType,
		days,
	};
};
