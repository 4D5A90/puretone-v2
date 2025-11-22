interface ScheduleWorkoutModalProps {
	scheduleDate: string;
	setScheduleDate: (date: string) => void;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ScheduleWorkoutModal({
	scheduleDate,
	setScheduleDate,
	onConfirm,
	onCancel,
}: ScheduleWorkoutModalProps) {
	return (
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
			<div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full border border-zinc-800">
				<h2 className="text-xl font-bold mb-4">Schedule Workout</h2>
				<label
					htmlFor="schedule-date"
					className="block mb-2 text-sm font-medium"
				>
					Select date
				</label>
				<input
					id="schedule-date"
					type="date"
					value={scheduleDate}
					onChange={(e) => setScheduleDate(e.target.value)}
					className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white mb-4"
				/>
				<div className="flex gap-3">
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={!scheduleDate}
						className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg"
					>
						Schedule
					</button>
				</div>
			</div>
		</div>
	);
}
