import { Flame, Footprints, GlassWater, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { useDailyTargets } from "../hooks/useDailyTargets";
import {
	ActivityMapping,
	ActivityRepository,
	type ActivityType,
} from "../services/storage/ActivityRepository";
import { storage } from "../services/storage/LocalStorageAdapter";

const activityRepo = new ActivityRepository(storage);

type ActivityConfig = {
	type: ActivityType;
	label: string;
	icon: typeof Footprints;
	color: string;
	bgColor: string;
	unit: string;
};

const activities: ActivityConfig[] = [
	{
		type: "steps",
		label: "Steps",
		icon: Footprints,
		color: "text-green-500",
		bgColor: "bg-green-500/20",
		unit: "steps",
	},
	{
		type: "cardio",
		label: "Cardio",
		icon: Flame,
		color: "text-orange-500",
		bgColor: "bg-orange-500/20",
		unit: "mins",
	},
	{
		type: "water",
		label: "Water",
		icon: GlassWater,
		color: "text-indigo-500",
		bgColor: "bg-indigo-500/20",
		unit: "cl",
	},
];

export default function ActivityPage() {
	const [selectedActivity, setSelectedActivity] =
		useState<ActivityConfig | null>(null);
	const [inputValue, setInputValue] = useState("");
	const { data, reload } = useDailyTargets();

	const todayActivity = {
		steps: data?.steps ?? 0,
		cardio: 0, // Will need to be added to DietService
		water: 0, // Will need to be added to DietService
	};

	const handleAddActivity = async () => {
		if (!selectedActivity) return;
		const amount = Number.parseInt(inputValue);
		if (Number.isNaN(amount) || amount <= 0) return;

		await activityRepo.addActivity(selectedActivity.type, amount);
		setInputValue("");
		setSelectedActivity(null);
		reload();
	};

	const openModal = (activity: ActivityConfig) => {
		setSelectedActivity(activity);
		setInputValue("");
	};

	const closeModal = () => {
		setSelectedActivity(null);
		setInputValue("");
	};

	return (
		<div className="space-y-6 pb-20">
			<header>
				<h1 className="text-2xl font-bold">Activity Tracker</h1>
				<p className="text-zinc-400 text-sm">Log your daily movement</p>
			</header>

			{/* Activity Cards Grid */}
			<div className="grid grid-cols-3 gap-4">
				{activities.map((activity) => {
					const Icon = activity.icon;

					return (
						<button
							key={activity.type}
							type="button"
							onClick={() => openModal(activity)}
							className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col items-center justify-center gap-2 aspect-square"
						>
							<div className={`p-3 ${activity.bgColor} rounded-xl`}>
								<Icon size={32} className={activity.color} />
							</div>
							<p className="text-xs text-zinc-500 uppercase tracking-wider">
								{activity.label}
							</p>
						</button>
					);
				})}
			</div>

			<div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
				<div className="flex justify-between items-center mb-2">
					<div>
						<p className="text-zinc-400 text-xs">Activity</p>
						<p className="text-xl font-bold text-white">
							{data?.steps ?? 0} steps
						</p>
					</div>
					<div className="text-right">
						<p className="text-green-500 font-bold">
							+{data?.stepCalories ?? 0} kcal
						</p>
					</div>
				</div>

				{data && data.logs.length > 0 && (
					<div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
						<p className="text-xs text-zinc-500 font-medium uppercase">
							Today's Activity
						</p>
						<div className="space-y-2 max-h-[120px] overflow-y-auto pr-2">
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
											{
												ActivityMapping[
													log.type as keyof typeof ActivityMapping
												]
											}
										</span>
									</div>
								))}
						</div>
					</div>
				)}
			</div>

			{/* Modal */}
			{selectedActivity && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
					<div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 p-6">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className={`p-2 ${selectedActivity.bgColor} rounded-lg`}>
									<selectedActivity.icon
										size={24}
										className={selectedActivity.color}
									/>
								</div>
								<div>
									<h2 className="text-lg font-bold text-white">
										Add {selectedActivity.label}
									</h2>
									<p className="text-sm text-zinc-400">
										Today: {todayActivity[selectedActivity.type]}{" "}
										{selectedActivity.unit}
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={closeModal}
								className="text-zinc-400 hover:text-white transition-colors"
							>
								<X size={24} />
							</button>
						</div>

						<div className="space-y-3">
							<input
								type="number"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleAddActivity()}
								className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-2xl font-bold text-center outline-none focus:border-blue-500 transition-colors text-white"
							/>
							<button
								type="button"
								onClick={handleAddActivity}
								className={`w-full ${selectedActivity.color.replace("text-", "bg-").replace("-500", "-600")} hover:opacity-90 text-white font-bold py-3 rounded-xl transition-opacity flex items-center justify-center gap-2`}
							>
								<PlusCircle size={20} />
								<span>Add {selectedActivity.label}</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
