import type { DailyTargets } from "../../hooks/useDailyTargets";
import { ActivityMapping } from "../../services/storage/ActivityRepository";

export const ActivityCard = ({ data }: { data: DailyTargets }) => {
	return (
		<div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
			<div className="flex justify-between items-center mb-2">
				<div>
					<p className="text-zinc-400 text-xs">Activity</p>
				</div>
				<p className="text-green-500 font-bold text-right">
					+{data?.activityCalories ?? 0} kcal
				</p>
			</div>

			{data && data.logs.length > 0 && (
				<div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
					<p className="text-xs text-zinc-500 font-medium uppercase">
						Today's Activity
					</p>
					<div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
						{[...data.logs]
							.reverse()
							.slice(0, 5)
							.map((log) => (
								<div
									key={log.id}
									className="flex justify-between text-sm text-zinc-400 bg-zinc-950/50 p-2 rounded"
								>
									<span>
										{new Date(log.timestamp).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
									<span className="text-white">
										+{log.amount}{" "}
										{ActivityMapping[log.type as keyof typeof ActivityMapping]}
									</span>
								</div>
							))}
					</div>
				</div>
			)}
		</div>
	);
};
