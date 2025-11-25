import type React from "react";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useWorkoutBuilder } from "../../hooks/useWorkoutBuilder";
import { VolumeBudget } from "./components/VolumeBudget";
import { DayBuilder } from "./components/DayBuilder";
import { ExercisePicker } from "./components/ExercisePicker";
import { ExerciseRepository } from "../../services/storage/ExerciseRepository";
import { storage } from "../../services/storage/LocalStorageAdapter";
import type { Exercise, MuscleGroup } from "./ExerciseDatabase";
import type { FocusLevel } from "../../services/WorkoutService";
import type { WorkoutSchedule, WorkoutPlan } from "./WorkoutGenerator";

interface WorkoutBuilderViewProps {
	initialDays: number;
	initialFocus: Partial<Record<MuscleGroup, FocusLevel>>;
	onComplete: (schedule: WorkoutSchedule) => void;
	onBack: () => void;
}

export const WorkoutBuilderView: React.FC<WorkoutBuilderViewProps> = ({
	initialDays,
	initialFocus,
	onComplete,
	onBack,
}) => {
	const {
		days,
		volumeTargets,
		currentVolume,
		addExerciseToDay,
		removeExerciseFromDay,
		updateSetReps,
		addSet,
		removeSet,
		updateDayName,
	} = useWorkoutBuilder(initialDays, initialFocus);

	const [allExercises, setAllExercises] = useState<Exercise[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [pickerState, setPickerState] = useState<{
		isOpen: boolean;
		dayId: string | null;
	}>({
		isOpen: false,
		dayId: null,
	});

	useEffect(() => {
		const loadExercises = async () => {
			const repo = new ExerciseRepository(storage);
			const exercises = await repo.getAllExercises();
			setAllExercises(exercises);
			setIsLoading(false);
		};
		loadExercises();
	}, []);

	const handleSave = () => {
		// Convert Builder State to WorkoutSchedule
		const schedule: WorkoutSchedule = {
			id: crypto.randomUUID(),
			splitType: "custom",
			days: days.map((day) => {
				const plan: WorkoutPlan = {
					id: day.id,
					name: day.name,
					focus: "medium", // Derived or generic
					exercises: day.exercises.map((ex) => {
						// Create sets with specific reps
						// Since WorkoutExercise structure is simple (sets count + reps string),
						// we might need to adapt it or simplify.
						// The current WorkoutExercise interface uses `sets: number` and `reps: string` (range).
						// The user wants individual set reps.
						// We might need to update WorkoutExercise interface or serialize it.
						// For now, let's average the reps or use a range string representation.

						const repsList = ex.sets.map((s) => s.reps);
						const minReps = Math.min(...repsList);
						const maxReps = Math.max(...repsList);
						const repsString =
							minReps === maxReps ? `${minReps}` : `${minReps}-${maxReps}`;

						return {
							exercise: ex.exercise,
							sets: ex.sets.length,
							reps: repsString,
							rest: 90, // Default rest
						};
					}),
				};
				return plan;
			}),
		};
		onComplete(schedule);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loader2 className="animate-spin text-blue-500" size={32} />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-black">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
				<button
					type="button"
					onClick={onBack}
					className="text-zinc-400 hover:text-white flex items-center gap-2"
				>
					<ArrowLeft size={20} /> Back
				</button>
				<h1 className="text-lg font-bold text-white">Build Your Split</h1>
				<button
					type="button"
					onClick={handleSave}
					className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
				>
					<Save size={18} /> Save
				</button>
			</div>

			{/* Volume Budget Sticky Header */}
			<VolumeBudget
				volumeTargets={volumeTargets}
				currentVolume={currentVolume}
			/>

			{/* Days Vertical List */}
			<div className="flex-1 overflow-y-auto p-4">
				<div className="flex flex-col gap-6 pb-20">
					{days.map((day) => (
						<DayBuilder
							key={day.id}
							day={day}
							onAddExercise={() =>
								setPickerState({ isOpen: true, dayId: day.id })
							}
							onRemoveExercise={(exId) => removeExerciseFromDay(day.id, exId)}
							onUpdateSetReps={(exId, setId, reps) =>
								updateSetReps(day.id, exId, setId, reps)
							}
							onAddSet={(exId) => addSet(day.id, exId)}
							onRemoveSet={(exId, setId) => removeSet(day.id, exId, setId)}
							onUpdateName={(name) => updateDayName(day.id, name)}
						/>
					))}
				</div>
			</div>

			{/* Exercise Picker Modal */}
			<ExercisePicker
				isOpen={pickerState.isOpen}
				onClose={() => setPickerState({ isOpen: false, dayId: null })}
				onSelect={(exercise) => {
					if (pickerState.dayId) {
						addExerciseToDay(pickerState.dayId, exercise);
					}
				}}
				exercises={allExercises}
			/>
		</div>
	);
};
