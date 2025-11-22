import { useState, useEffect, useCallback } from "react";
import { Flame, Footprints, Save } from "lucide-react";
import { storage } from "../services/storage/LocalStorageAdapter";
import { ActivityRepository } from "../services/storage/ActivityRepository";

const activityRepo = new ActivityRepository(storage);

export default function ActivityPage() {
	const [stepsToAdd, setStepsToAdd] = useState("");
	const [cardioToAdd, setCardioToAdd] = useState("");
	const [todayActivity, setTodayActivity] = useState({
		steps: 0,
		cardioMinutes: 0,
	});

	const loadToday = useCallback(async () => {
		const today = await activityRepo.getTodayActivity();
		setTodayActivity({
			steps: today.steps,
			cardioMinutes: today.cardioMinutes,
		});
	}, []);

	useEffect(() => {
		loadToday();
	}, [loadToday]);

	const handleAddSteps = async () => {
		const amount = Number.parseInt(stepsToAdd);
		if (Number.isNaN(amount) || amount <= 0) return;

		await activityRepo.addActivity("steps", amount);
		setStepsToAdd("");
		loadToday();
	};

	const handleAddCardio = async () => {
		const amount = Number.parseInt(cardioToAdd);
		if (Number.isNaN(amount) || amount <= 0) return;

		await activityRepo.addActivity("cardio", amount);
		setCardioToAdd("");
		loadToday();
	};

	return (
		<div className="space-y-6 pb-20">
			<header>
				<h1 className="text-2xl font-bold">Activity Tracker</h1>
				<p className="text-zinc-400 text-sm">Log your daily movement</p>
			</header>

			<div className="grid gap-4">
				<div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
							<Footprints size={24} />
						</div>
						<div className="flex-1">
							<h2 className="font-bold text-lg">Steps</h2>
							<p className="text-sm text-zinc-400">
								Today: {todayActivity.steps} steps
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<input
							type="number"
							value={stepsToAdd}
							onChange={(e) => setStepsToAdd(e.target.value)}
							placeholder="Add steps..."
							className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-lg font-bold text-center outline-none focus:border-blue-500 transition-colors"
						/>
						<button
							type="button"
							onClick={handleAddSteps}
							className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors"
						>
							<Save size={20} />
						</button>
					</div>
				</div>

				<div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
							<Flame size={24} />
						</div>
						<div className="flex-1">
							<h2 className="font-bold text-lg">Cardio</h2>
							<p className="text-sm text-zinc-400">
								Today: {todayActivity.cardioMinutes} mins
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<input
							type="number"
							value={cardioToAdd}
							onChange={(e) => setCardioToAdd(e.target.value)}
							placeholder="Add minutes..."
							className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-lg font-bold text-center outline-none focus:border-orange-500 transition-colors"
						/>
						<button
							type="button"
							onClick={handleAddCardio}
							className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl transition-colors"
						>
							<Save size={20} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
