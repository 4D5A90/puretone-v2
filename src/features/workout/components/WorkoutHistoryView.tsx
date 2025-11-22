import { Calendar, Clock } from "lucide-react";
import type { CompletedWorkout } from "../../../services/storage/WorkoutRepository";

interface WorkoutHistoryViewProps {
	history: CompletedWorkout[];
	onSelect: (workout: CompletedWorkout) => void;
	onClose: () => void;
}

export function WorkoutHistoryView({
	history,
	onSelect,
	onClose,
}: WorkoutHistoryViewProps) {
	return (
		<div className="pb-20 h-[calc(100vh-100px)] flex flex-col">
			<header className="mb-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold">Workout History</h1>
				<button
					type="button"
					onClick={onClose}
					className="text-sm text-zinc-400 hover:text-white"
				>
					Back
				</button>
			</header>
			<div className="flex-1 overflow-y-auto space-y-4">
				{history.length === 0 ? (
					<div className="text-center text-zinc-500 py-10">
						No completed workouts found.
					</div>
				) : (
					history.map((workout) => (
						<button
							key={workout.id}
							type="button"
							onClick={() => onSelect(workout)}
							className="w-full bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-left hover:bg-zinc-800 transition-colors"
						>
							<div className="flex justify-between items-start mb-2">
								<h3 className="font-bold text-lg">{workout.name}</h3>
								<span className="text-xs text-zinc-500 flex items-center gap-1">
									<Calendar size={12} />
									{new Date(workout.date).toLocaleDateString()}
								</span>
							</div>
							<div className="text-sm text-zinc-400 flex gap-4">
								<span className="flex items-center gap-1">
									<Clock size={14} />
									{Math.round(workout.durationSeconds / 60)} min
								</span>
								<span>{workout.exercises.length} exercises</span>
							</div>
						</button>
					))
				)}
			</div>
		</div>
	);
}
