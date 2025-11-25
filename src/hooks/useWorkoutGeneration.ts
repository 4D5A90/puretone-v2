import { useState } from "react";
import {
	generateSchedule,
	type SplitType,
	type WorkoutSchedule,
} from "../features/workout/WorkoutGenerator";
import type { MuscleGroup } from "../features/workout/ExerciseDatabase";
import type { FocusLevel } from "../services/WorkoutService";
import type { ColumnId } from "./useCustomSplit";

import { storage } from "../services/storage/LocalStorageAdapter";
import { ExerciseRepository } from "../services/storage/ExerciseRepository";

// ... imports

export function useWorkoutGeneration() {
	const [generatedSchedule, setGeneratedSchedule] =
		useState<WorkoutSchedule | null>(null);
	const [selectedDayIndex, setSelectedDayIndex] = useState(0);
	const [selectedSplit, setSelectedSplit] = useState<SplitType | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);

	const generate = async (
		split: SplitType,
		days: number,
		customSplitType: "single" | "ppl" | "upper_lower" | "full_body",
		columns: Record<ColumnId, MuscleGroup[]>,
		customDayColumns: Record<number, Record<ColumnId, MuscleGroup[]>>,
		repRanges: {
			compound: { min: number; max: number };
			isolation: { min: number; max: number };
		},
	) => {
		setIsGenerating(true);
		let muscleFocus: Partial<Record<MuscleGroup, FocusLevel>> | undefined;
		let multiDayFocus:
			| Array<Partial<Record<MuscleGroup, FocusLevel>>>
			| undefined;

		if (split === "custom") {
			if (customSplitType === "single") {
				// Single day custom - use columns
				muscleFocus = {} as Record<MuscleGroup, FocusLevel>;
				for (const m of columns.high) muscleFocus[m] = "high";
				for (const m of columns.medium) muscleFocus[m] = "medium";
				for (const m of columns.low) muscleFocus[m] = "low";

				if (Object.keys(muscleFocus).length === 0) {
					setIsGenerating(false);
					return;
				}
			} else {
				// Multi-day custom - use customDayColumns
				multiDayFocus = [];
				for (let i = 0; i < days; i++) {
					const dayColumns = customDayColumns[i];
					if (!dayColumns) continue;

					const dayFocus: Partial<Record<MuscleGroup, FocusLevel>> = {};
					for (const m of dayColumns.high) dayFocus[m] = "high";
					for (const m of dayColumns.medium) dayFocus[m] = "medium";
					for (const m of dayColumns.low) dayFocus[m] = "low";

					multiDayFocus.push(dayFocus);
				}

				if (multiDayFocus.length === 0) {
					setIsGenerating(false);
					return;
				}
			}
		}

		const exerciseRepo = new ExerciseRepository(storage);
		const allExercises = await exerciseRepo.getAllExercises();

		const schedule = await generateSchedule(
			split,
			days,
			allExercises,
			muscleFocus,
			multiDayFocus,
			repRanges,
		);
		setGeneratedSchedule(schedule);
		setSelectedDayIndex(0);
		setIsGenerating(false);
	};

	const updateExerciseSets = (exerciseIndex: number, newSets: number) => {
		if (!generatedSchedule) return;

		const updatedDays = [...generatedSchedule.days];
		const currentDay = updatedDays[selectedDayIndex];
		const updatedExercises = [...currentDay.exercises];
		updatedExercises[exerciseIndex] = {
			...updatedExercises[exerciseIndex],
			sets: newSets,
		};

		updatedDays[selectedDayIndex] = {
			...currentDay,
			exercises: updatedExercises,
		};

		setGeneratedSchedule({
			...generatedSchedule,
			days: updatedDays,
		});
	};

	const reset = () => {
		setGeneratedSchedule(null);
		setSelectedSplit(null);
		setSelectedDayIndex(0);
	};

	return {
		generatedSchedule,
		setGeneratedSchedule,
		selectedDayIndex,
		setSelectedDayIndex,
		selectedSplit,
		setSelectedSplit,
		generate,
		updateExerciseSets,
		reset,
		isGenerating,
	};
}
