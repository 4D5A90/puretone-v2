import {
	type Exercise,
	exerciseDatabase,
	type MuscleGroup,
} from "./ExerciseDatabase";
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
	high: { min: 4, max: 6 }, // Sets per session for high focus
	medium: { min: 3, max: 4 },
	low: { min: 2, max: 3 },
};

// Split muscle groups by type
export const PUSH_MUSCLES: MuscleGroup[] = ["chest", "shoulders", "triceps"];
export const PULL_MUSCLES: MuscleGroup[] = ["back", "biceps"];
export const LEG_MUSCLES: MuscleGroup[] = [
	"quads",
	"hamstrings",
	"calves",
	"glutes",
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
];

export const generateWorkout = (
	muscleFocus: Partial<Record<MuscleGroup, FocusLevel>>,
	repRanges?: {
		compound?: { min: number; max: number };
		isolation?: { min: number; max: number };
	},
): WorkoutPlan => {
	const plan: WorkoutExercise[] = [];
	const targetMuscles = Object.keys(muscleFocus) as MuscleGroup[];

	// Default rep ranges if not provided
	const compoundReps = repRanges?.compound
		? `${repRanges.compound.min}-${repRanges.compound.max}`
		: "6-10";
	const isolationReps = repRanges?.isolation
		? `${repRanges.isolation.min}-${repRanges.isolation.max}`
		: "8-12";

	for (const muscle of targetMuscles) {
		const focusLevel = muscleFocus[muscle] || "medium";
		// Determine volume based on focus
		const volume = VOLUME_GUIDELINES[focusLevel];

		// Get exercises for this muscle
		const muscleExercises = exerciseDatabase.filter((e) =>
			e.targetMuscles.includes(muscle),
		);

		// Sort by compound first
		const compounds = muscleExercises.filter((e) => e.type === "compound");
		const isolations = muscleExercises.filter((e) => e.type === "isolation");

		// Select exercises to meet volume
		// Strategy: 1 main compound (3-4 sets) + optional isolation

		let currentSets = 0;

		// Add Compound
		if (compounds.length > 0) {
			const selected = compounds[Math.floor(Math.random() * compounds.length)];
			const sets = focusLevel === "high" ? 4 : 3;
			plan.push({
				exercise: selected,
				sets: sets,
				reps: compoundReps, // Use custom rep range
				rest: 120,
			});
			currentSets += sets;
		}

		// Add Isolation if needed for volume
		if (currentSets < volume.min && isolations.length > 0) {
			const selected =
				isolations[Math.floor(Math.random() * isolations.length)];
			const sets = Math.max(2, volume.min - currentSets);
			if (sets > 0) {
				plan.push({
					exercise: selected,
					sets: sets,
					reps: isolationReps, // Use custom rep range
					rest: 90,
				});
			}
		}
	}

	return {
		id: crypto.randomUUID(),
		name: "Custom Workout",
		exercises: plan,
		focus: "medium", // Deprecated or calculated average
	};
};

export const generateSchedule = (
	splitType: SplitType,
	daysPerWeek: number,
	customMuscleFocus?: Partial<Record<MuscleGroup, FocusLevel>>,
	multiDayFocus?: Array<Partial<Record<MuscleGroup, FocusLevel>>>,
	repRanges?: {
		compound?: { min: number; max: number };
		isolation?: { min: number; max: number };
	},
): WorkoutSchedule => {
	const days: WorkoutPlan[] = [];

	if (splitType === "custom") {
		if (multiDayFocus && multiDayFocus.length > 0) {
			// Multi-day custom - use per-day muscle focus
			for (let i = 0; i < multiDayFocus.length; i++) {
				const workout = generateWorkout(multiDayFocus[i], repRanges);
				workout.name = `Custom Day ${i + 1}`;
				days.push(workout);
			}
		} else if (customMuscleFocus) {
			// Single day custom - repeat the same workout
			for (let i = 0; i < daysPerWeek; i++) {
				const workout = generateWorkout(customMuscleFocus, repRanges);
				workout.name = `Custom Workout ${i + 1}`;
				days.push(workout);
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

		const push = generateWorkout(pushFocus);
		push.name = "Push Day";

		const pull = generateWorkout(pullFocus);
		pull.name = "Pull Day";

		const legs = generateWorkout(legFocus);
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

		const upper = generateWorkout(upperFocus);
		upper.name = "Upper Body";

		const lower = generateWorkout(lowerFocus);
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

		const fullBody = generateWorkout(fullBodyFocus);
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
