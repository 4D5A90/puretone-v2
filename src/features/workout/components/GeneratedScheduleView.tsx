import { ChevronLeft, ChevronRight, Calendar, Play } from "lucide-react";
import type { WorkoutSchedule } from "../WorkoutGenerator";

interface GeneratedScheduleViewProps {
	schedule: WorkoutSchedule;
	selectedDayIndex: number;
	setSelectedDayIndex: (index: number) => void;
	onReset: () => void;
	onUpdateSets: (exerciseIndex: number, sets: number) => void;
	onSaveTemplate: () => void;
	onSchedule: () => void;
	onStart: () => void;
}

export function GeneratedScheduleView({
	schedule,
	selectedDayIndex,
	setSelectedDayIndex,
	onReset,
	onUpdateSets,
	onSaveTemplate,
	onSchedule,
	onStart,
}: GeneratedScheduleViewProps) {
	return (
		<div className="space-y-6 overflow-y-auto flex-1 pb-4">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-bold">
					{schedule.days[selectedDayIndex].name}
				</h2>
				<button
					type="button"
					onClick={onReset}
					className="text-sm text-zinc-400 hover:text-white"
				>
					Reset
				</button>
			</div>

			{schedule.days.length > 1 && (
				<div className="flex items-center justify-between bg-zinc-900 p-3 rounded-xl border border-zinc-800">
					<button
						type="button"
						onClick={() =>
							setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))
						}
						disabled={selectedDayIndex === 0}
						className="p-2 disabled:opacity-30"
					>
						<ChevronLeft size={20} />
					</button>
					<span className="text-sm font-medium">
						Day {selectedDayIndex + 1} of {schedule.days.length}
					</span>
					<button
						type="button"
						onClick={() =>
							setSelectedDayIndex(
								Math.min(schedule.days.length - 1, selectedDayIndex + 1),
							)
						}
						disabled={selectedDayIndex === schedule.days.length - 1}
						className="p-2 disabled:opacity-30"
					>
						<ChevronRight size={20} />
					</button>
				</div>
			)}

			<div className="space-y-4">
				{schedule.days[selectedDayIndex].exercises.map((item, idx) => (
					<div
						key={`${item.exercise.id}-${idx}`}
						className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"
					>
						<h3 className="font-bold text-lg mb-2">{item.exercise.name}</h3>
						<div className="flex gap-4 text-sm items-center">
							<div className="flex items-center gap-2">
								<input
									type="number"
									value={item.sets}
									onChange={(e) =>
										onUpdateSets(idx, Number.parseInt(e.target.value) || 0)
									}
									className="w-12 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-center text-white"
									min="1"
									max="10"
								/>
								<span className="text-zinc-400">sets</span>
							</div>
							<span className="text-zinc-400">{item.reps} reps</span>
							<span className="text-zinc-400">{item.rest}s rest</span>
						</div>
					</div>
				))}
			</div>

			<div className="grid grid-cols-3 gap-3">
				<button
					type="button"
					onClick={onSaveTemplate}
					className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-colors text-sm"
				>
					Save as Template
				</button>
				<button
					type="button"
					onClick={onSchedule}
					className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
				>
					<Calendar size={18} />
					Schedule
				</button>
				<button
					type="button"
					onClick={onStart}
					className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
				>
					<Play size={20} />
					Start
				</button>
			</div>
		</div>
	);
}
