import { useState, useEffect, useCallback } from "react";
import { Flame, Footprints, GlassWater, Save } from "lucide-react";
import { storage } from "../services/storage/LocalStorageAdapter";
import { ActivityRepository } from "../services/storage/ActivityRepository";

const activityRepo = new ActivityRepository(storage);

export default function ActivityPage() {
	const [stepsToAdd, setStepsToAdd] = useState("");
	const [cardioToAdd, setCardioToAdd] = useState("");
	const [waterToAdd, setWaterToAdd] = useState("");
	const [todayActivity, setTodayActivity] = useState({
		steps: 0,
		cardio: 0,
		water: 0,
	});

	const loadToday = useCallback(async () => {
		const today = await activityRepo.getTodayActivity();
		setTodayActivity({
			steps: today.steps,
			cardio: today.cardio,
			water: today.water,
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

	const handleAddWater = async () => {
		const amount = Number.parseInt(waterToAdd);
		if (Number.isNaN(amount) || amount <= 0) return;

		await activityRepo.addActivity("water", amount);
		setWaterToAdd("");
		loadToday();
	};

	return (
		<div className="space-y-6 pb-20">
			<header>
				<h1 className="text-2xl font-bold">Activity Tracker</h1>
				<p className="text-zinc-400 text-sm">Log your daily movement</p>
			</header>

			<div className="flex gap-4 flex-col md:flex-row">
				<div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-green-500/20 rounded-lg text-green-500">
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
							className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition-colors"
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
								Today: {todayActivity.cardio} mins
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

				<div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-500">
							<GlassWater size={24} />
						</div>
						<div className="flex-1">
							<h2 className="font-bold text-lg">Water</h2>
							<p className="text-sm text-zinc-400">
								Today: {todayActivity.water} cl
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<input
							type="number"
							value={waterToAdd}
							onChange={(e) => setWaterToAdd(e.target.value)}
							placeholder="Add litres..."
							className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-lg font-bold text-center outline-none focus:border-orange-500 transition-colors"
						/>
						<button
							type="button"
							onClick={handleAddWater}
							className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-colors"
						>
							<Save size={20} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
