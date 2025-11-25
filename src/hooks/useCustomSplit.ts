import { useState, useEffect, useCallback } from "react";
import type { MuscleGroup } from "../features/workout/ExerciseDatabase";
import {
	PUSH_MUSCLES,
	PULL_MUSCLES,
	LEG_MUSCLES,
	UPPER_MUSCLES,
	LOWER_MUSCLES,
} from "../features/workout/WorkoutGenerator";

export type ColumnId = "available" | "high" | "medium" | "low";

export const MUSCLE_GROUPS: { id: MuscleGroup; label: string }[] = [
	{ id: "chest", label: "Chest" },
	{ id: "back", label: "Back" },
	{ id: "shoulders", label: "Shoulders" },
	{ id: "biceps", label: "Biceps" },
	{ id: "triceps", label: "Triceps" },
	{ id: "quads", label: "Quads" },
	{ id: "hamstrings", label: "Hamstrings" },
	{ id: "glutes", label: "Glutes" },
	{ id: "adductors", label: "Adductors" },
	{ id: "calves", label: "Calves" },
	{ id: "abs", label: "Abs" },
];

export function useCustomSplit() {
	const [customSplitType, setCustomSplitType] = useState<
		"single" | "ppl" | "upper_lower" | "full_body"
	>("single");
	const [daysPerWeek, setDaysPerWeek] = useState(3);
	const [currentCustomDay, setCurrentCustomDay] = useState(0);

	// Rep range configuration
	const [repRanges, setRepRanges] = useState({
		compound: { min: 6, max: 10 },
		isolation: { min: 8, max: 12 },
	});

	// State for columns (for custom split)
	const [columns, setColumns] = useState<Record<ColumnId, MuscleGroup[]>>({
		available: MUSCLE_GROUPS.map((m) => m.id),
		high: [],
		medium: [],
		low: [],
	});

	// Multi-day custom columns (one set per day)
	const [customDayColumns, setCustomDayColumns] = useState<
		Record<number, Record<ColumnId, MuscleGroup[]>>
	>({
		0: {
			available: MUSCLE_GROUPS.map((m) => m.id),
			high: [],
			medium: [],
			low: [],
		},
	});

	// Helper to get available muscles
	const getAvailableMuscles = useCallback((usedMuscles: MuscleGroup[]) => {
		return MUSCLE_GROUPS.map((m) => m.id).filter(
			(m) => !usedMuscles.includes(m),
		);
	}, []);

	// Clamp currentCustomDay when daysPerWeek changes
	useEffect(() => {
		if (currentCustomDay >= daysPerWeek) {
			setCurrentCustomDay(daysPerWeek - 1);
		}
	}, [daysPerWeek, currentCustomDay]);

	// Initialize multi-day columns when split type changes
	useEffect(() => {
		if (customSplitType !== "single") {
			setCustomDayColumns((prev) => {
				const newColumns: Record<number, Record<ColumnId, MuscleGroup[]>> = {};

				// Pre-fill based on split type
				if (customSplitType === "ppl") {
					// Day 1: Push
					newColumns[0] = {
						available: getAvailableMuscles(PUSH_MUSCLES),
						high: PUSH_MUSCLES,
						medium: [],
						low: [],
					};
					// Day 2: Pull
					newColumns[1] = {
						available: getAvailableMuscles(PULL_MUSCLES),
						high: PULL_MUSCLES,
						medium: [],
						low: [],
					};
					// Day 3: Legs
					newColumns[2] = {
						available: getAvailableMuscles(LEG_MUSCLES),
						high: LEG_MUSCLES,
						medium: [],
						low: [],
					};
				} else if (customSplitType === "upper_lower") {
					// Day 1: Upper
					newColumns[0] = {
						available: getAvailableMuscles(UPPER_MUSCLES),
						high: UPPER_MUSCLES,
						medium: [],
						low: [],
					};
					// Day 2: Lower
					newColumns[1] = {
						available: getAvailableMuscles(LOWER_MUSCLES),
						high: LOWER_MUSCLES,
						medium: [],
						low: [],
					};
				} else if (customSplitType === "full_body") {
					const medium = ["chest", "back", "quads"] as MuscleGroup[];
					const low = ["shoulders", "biceps", "triceps"] as MuscleGroup[];
					const used = [...medium, ...low];

					// Day 1-3: Full Body
					for (let i = 0; i < 3; i++) {
						newColumns[i] = {
							available: getAvailableMuscles(used),
							high: [],
							medium: medium,
							low: low,
						};
					}
				}

				for (let i = 0; i < daysPerWeek; i++) {
					if (!newColumns[i]) {
						// Preserve existing if available, otherwise empty
						if (prev[i] && Object.keys(prev[i]).length > 0) {
							newColumns[i] = prev[i];
						} else {
							newColumns[i] = {
								available: MUSCLE_GROUPS.map((m) => m.id),
								high: [],
								medium: [],
								low: [],
							};
						}
					}
				}
				return newColumns;
			});
		}
	}, [customSplitType, daysPerWeek, getAvailableMuscles]);

	// Get current columns based on split type
	const getCurrentColumns = useCallback(() => {
		if (customSplitType === "single") {
			return columns;
		}
		return (
			customDayColumns[currentCustomDay] || {
				available: MUSCLE_GROUPS.map((m) => m.id),
				high: [],
				medium: [],
				low: [],
			}
		);
	}, [customSplitType, columns, customDayColumns, currentCustomDay]);

	// Update columns based on split type
	const updateCurrentColumns = useCallback(
		(newColumns: Record<ColumnId, MuscleGroup[]>) => {
			if (customSplitType === "single") {
				setColumns(newColumns);
			} else {
				setCustomDayColumns((prev) => ({
					...prev,
					[currentCustomDay]: newColumns,
				}));
			}
		},
		[customSplitType, currentCustomDay],
	);

	const moveMuscle = useCallback(
		(muscle: MuscleGroup, targetCol: ColumnId) => {
			const currentCols = getCurrentColumns();
			const newCols = { ...currentCols };
			for (const col of Object.keys(newCols) as ColumnId[]) {
				newCols[col] = newCols[col].filter((m) => m !== muscle);
			}
			newCols[targetCol] = [...newCols[targetCol], muscle];
			updateCurrentColumns(newCols);
		},
		[getCurrentColumns, updateCurrentColumns],
	);

	return {
		customSplitType,
		setCustomSplitType,
		daysPerWeek,
		setDaysPerWeek,
		currentCustomDay,
		setCurrentCustomDay,
		repRanges,
		setRepRanges,
		columns,
		setColumns,
		customDayColumns,
		getCurrentColumns,
		updateCurrentColumns,
		moveMuscle,
	};
}
