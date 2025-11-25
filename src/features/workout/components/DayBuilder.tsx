import type React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { BuilderDay } from "../../../hooks/useWorkoutBuilder";
import { SetConfiguration } from "./SetConfiguration";

interface DayBuilderProps {
	day: BuilderDay;
	onAddExercise: () => void;
	onRemoveExercise: (exerciseId: string) => void;
	onUpdateSetReps: (exerciseId: string, setId: string, reps: number) => void;
	onAddSet: (exerciseId: string) => void;
	onRemoveSet: (exerciseId: string, setId: string) => void;
	onUpdateName: (name: string) => void;
}

export const DayBuilder: React.FC<DayBuilderProps> = ({
	day,
	onAddExercise,
	onRemoveExercise,
	onUpdateSetReps,
	onAddSet,
	onRemoveSet,
	onUpdateName,
}) => {
	return (
		<div className="w-full bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
			{/* Header */}
			<div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
				<input
					type="text"
					value={day.name}
					onChange={(e) => onUpdateName(e.target.value)}
					className="bg-transparent text-lg font-bold text-white outline-none w-full placeholder-zinc-600"
					placeholder="Day Name"
				/>
				<div className="text-xs text-zinc-500 mt-1">
					{day.exercises.length} exercises •{" "}
					{day.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} sets
				</div>
			</div>

			{/* Exercises List */}
			<div className="flex-1 overflow-y-auto p-3 space-y-3">
				{day.exercises.map((exercise) => (
					<div
						key={exercise.id}
						className="bg-zinc-950 border border-zinc-800 rounded-xl p-3"
					>
						<div className="flex justify-between items-start mb-3">
							<div>
								<h4 className="font-medium text-zinc-200 text-sm">
									{exercise.exercise.name}
								</h4>
								<p className="text-[10px] text-zinc-500 capitalize">
									{exercise.exercise.targetMuscles.join(", ")}
								</p>
							</div>
							<button
								type="button"
								onClick={() => onRemoveExercise(exercise.id)}
								className="text-zinc-600 hover:text-red-400 transition-colors"
							>
								<Trash2 size={14} />
							</button>
						</div>

						<div className="space-y-2">
							{exercise.sets.map((set, index) => (
								<SetConfiguration
									key={set.id}
									setNumber={index + 1}
									reps={set.reps}
									onRepsChange={(reps) =>
										onUpdateSetReps(exercise.id, set.id, reps)
									}
									onRemove={() => onRemoveSet(exercise.id, set.id)}
								/>
							))}
						</div>

						<button
							type="button"
							onClick={() => onAddSet(exercise.id)}
							className="w-full mt-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors flex items-center justify-center gap-1"
						>
							<Plus size={12} /> Add Set
						</button>
					</div>
				))}

				<button
					type="button"
					onClick={onAddExercise}
					className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors flex flex-col items-center justify-center gap-2"
				>
					<Plus size={24} />
					<span className="text-sm font-medium">Add Exercise</span>
				</button>
			</div>
		</div>
	);
};
