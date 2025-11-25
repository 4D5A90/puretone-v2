import { useState, useMemo, useCallback } from "react";
import type {
	MuscleGroup,
	Exercise,
} from "../features/workout/ExerciseDatabase";
import type { FocusLevel } from "../services/WorkoutService";

export interface BuilderSet {
	id: string;
	reps: number;
	weight?: number;
}

export interface BuilderExercise {
	id: string; // Instance ID
	exercise: Exercise;
	sets: BuilderSet[];
}

export interface BuilderDay {
	id: string;
	name: string;
	exercises: BuilderExercise[];
}

const VOLUME_GUIDELINES = {
	high: { min: 12, max: 16 },
	medium: { min: 6, max: 12 },
	low: { min: 3, max: 5 },
};

export function useWorkoutBuilder(
	initialDays = 3,
	initialFocus: Partial<Record<MuscleGroup, FocusLevel>> = {},
) {
	const [days, setDays] = useState<BuilderDay[]>(() => {
		return Array.from({ length: initialDays }).map((_, i) => ({
			id: crypto.randomUUID(),
			name: `Day ${i + 1}`,
			exercises: [],
		}));
	});

	const [muscleFocus, setMuscleFocus] =
		useState<Partial<Record<MuscleGroup, FocusLevel>>>(initialFocus);

	// Calculate Volume Targets based on Focus
	const volumeTargets = useMemo(() => {
		const targets: Partial<Record<MuscleGroup, { min: number; max: number }>> =
			{};
		for (const [muscle, focus] of Object.entries(muscleFocus)) {
			targets[muscle as MuscleGroup] = VOLUME_GUIDELINES[focus];
		}
		return targets;
	}, [muscleFocus]);

	// Calculate Current Volume (Total Sets per Muscle)
	const currentVolume = useMemo(() => {
		const volume: Partial<Record<MuscleGroup, number>> = {};

		// Initialize tracked muscles with 0
		for (const m of Object.keys(muscleFocus)) {
			volume[m as MuscleGroup] = 0;
		}

		for (const day of days) {
			for (const ex of day.exercises) {
				for (const muscle of ex.exercise.targetMuscles) {
					if (volume[muscle] !== undefined) {
						volume[muscle] = (volume[muscle] || 0) + ex.sets.length;
					}
				}
			}
		}

		return volume;
	}, [days, muscleFocus]);

	// Actions
	const addExerciseToDay = useCallback((dayId: string, exercise: Exercise) => {
		setDays((prev) =>
			prev.map((day) => {
				if (day.id !== dayId) return day;
				return {
					...day,
					exercises: [
						...day.exercises,
						{
							id: crypto.randomUUID(),
							exercise,
							sets: [
								{ id: crypto.randomUUID(), reps: 10 },
								{ id: crypto.randomUUID(), reps: 10 },
								{ id: crypto.randomUUID(), reps: 10 },
							], // Default 3 sets
						},
					],
				};
			}),
		);
	}, []);

	const removeExerciseFromDay = useCallback(
		(dayId: string, exerciseInstanceId: string) => {
			setDays((prev) =>
				prev.map((day) => {
					if (day.id !== dayId) return day;
					return {
						...day,
						exercises: day.exercises.filter((e) => e.id !== exerciseInstanceId),
					};
				}),
			);
		},
		[],
	);

	const updateSetReps = useCallback(
		(
			dayId: string,
			exerciseInstanceId: string,
			setId: string,
			reps: number,
		) => {
			setDays((prev) =>
				prev.map((day) => {
					if (day.id !== dayId) return day;
					return {
						...day,
						exercises: day.exercises.map((ex) => {
							if (ex.id !== exerciseInstanceId) return ex;
							return {
								...ex,
								sets: ex.sets.map((s) => (s.id === setId ? { ...s, reps } : s)),
							};
						}),
					};
				}),
			);
		},
		[],
	);

	const addSet = useCallback((dayId: string, exerciseInstanceId: string) => {
		setDays((prev) =>
			prev.map((day) => {
				if (day.id !== dayId) return day;
				return {
					...day,
					exercises: day.exercises.map((ex) => {
						if (ex.id !== exerciseInstanceId) return ex;
						const lastSetReps =
							ex.sets.length > 0 ? ex.sets[ex.sets.length - 1].reps : 10;
						return {
							...ex,
							sets: [
								...ex.sets,
								{ id: crypto.randomUUID(), reps: lastSetReps },
							],
						};
					}),
				};
			}),
		);
	}, []);

	const removeSet = useCallback(
		(dayId: string, exerciseInstanceId: string, setId: string) => {
			setDays((prev) =>
				prev.map((day) => {
					if (day.id !== dayId) return day;
					return {
						...day,
						exercises: day.exercises.map((ex) => {
							if (ex.id !== exerciseInstanceId) return ex;
							return {
								...ex,
								sets: ex.sets.filter((s) => s.id !== setId),
							};
						}),
					};
				}),
			);
		},
		[],
	);

	const updateDayName = useCallback((dayId: string, name: string) => {
		setDays((prev) =>
			prev.map((day) => (day.id === dayId ? { ...day, name } : day)),
		);
	}, []);

	return {
		days,
		setDays,
		muscleFocus,
		setMuscleFocus,
		volumeTargets,
		currentVolume,
		addExerciseToDay,
		removeExerciseFromDay,
		updateSetReps,
		addSet,
		removeSet,
		updateDayName,
	};
}
