import { Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDailyTargets } from "../hooks/useDailyTargets";
import { storage } from "../services/storage/LocalStorageAdapter";
import {
	type ScheduledWorkout,
	ScheduledWorkoutRepository,
} from "../services/storage/ScheduledWorkoutRepository";
import { WorkoutTemplateRepository } from "../services/storage/WorkoutTemplateRepository";
import { useUserStore } from "../store/userStore";

const scheduledRepo = new ScheduledWorkoutRepository(storage);
const templateRepo = new WorkoutTemplateRepository(storage);

export default function DashboardPage() {
	const navigate = useNavigate();
	const profile = useUserStore((state) => state.profile);
	const { targets, isLoading } = useDailyTargets();
	const [todayWorkout, setTodayWorkout] = useState<ScheduledWorkout | null>(
		null,
	);

	const loadTodayWorkout = useCallback(async () => {
		const workout = await scheduledRepo.getTodayWorkout();
		setTodayWorkout(workout);
	}, []);

	useEffect(() => {
		loadTodayWorkout();
	}, [loadTodayWorkout]);

	if (!profile || isLoading || !targets)
		return <div className="p-6 text-center text-zinc-400">Loading...</div>;

	return (
		<div className="space-y-6 pb-20">
			{/* Today's Scheduled Workout */}
			{todayWorkout && (
				<div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-6 rounded-2xl border border-blue-800/50">
					<div className="flex justify-between items-start mb-3">
						<div>
							<p className="text-blue-300 text-sm mb-1">Today's Workout</p>
							<h3 className="text-xl font-bold text-white">
								{todayWorkout.templateName}
							</h3>
						</div>
						<button
							type="button"
							onClick={async () => {
								const template = await templateRepo.getTemplate(
									todayWorkout.templateId,
								);
								if (template) {
									navigate("/workout/active", {
										state: { workout: template.days[0] },
									});
								}
							}}
							className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
						>
							<Play size={20} />
							Start Workout
						</button>
					</div>
					<p className="text-blue-200 text-sm">
						Scheduled for{" "}
						{new Date(todayWorkout.scheduledDate).toLocaleDateString()}
					</p>
				</div>
			)}

			<div className="grid grid-cols-2 gap-4">
				<div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 col-span-2">
					<div className="flex items-center gap-6">
						<div className="flex-1">
							<p className="text-zinc-400 text-sm mb-1">Daily Target</p>
							<h2 className="text-3xl font-bold text-white">
								{targets.dailyCaloriesTarget}{" "}
								<span className="text-base text-zinc-500">kcal</span>
							</h2>
						</div>

						<div className="h-16 w-px bg-zinc-800" />

						<div className="flex-1">
							<p className="text-zinc-400 text-sm mb-1">TDEE</p>
							<h2 className="text-3xl font-bold text-white">
								{targets.totalTDEE}{" "}
								<span className="text-base text-zinc-500">kcal</span>
							</h2>
						</div>
					</div>
				</div>
				<div className="col-span-2">
					<div className="grid grid-cols-3 gap-4">
						<MacroCard label="Protein" amount={targets.macros.protein} />
						<MacroCard label="Carbs" amount={targets.macros.carbs} />
						<MacroCard label="Fats" amount={targets.macros.fats} />
					</div>
				</div>

				{/* Steps Progress */}
				<div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 col-span-2">
					<div className="flex justify-between items-center mb-3">
						<p className="text-zinc-400 text-sm">Daily Steps</p>
						<p className="text-sm font-medium text-white">
							{targets.steps.toLocaleString()} /{" "}
							{targets.estimatedDailySteps?.toLocaleString()}
						</p>
					</div>
					<div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
						<div
							className={`h-full transition-all duration-500 ${
								targets.steps >= targets.estimatedDailySteps
									? "bg-gradient-to-r from-green-500 to-emerald-500"
									: targets.steps >= targets.estimatedDailySteps * 0.5
										? "bg-gradient-to-r from-blue-500 to-cyan-500"
										: "bg-gradient-to-r from-zinc-600 to-zinc-500"
							}`}
							style={{
								width: `${Math.min((targets.steps / targets.estimatedDailySteps) * 100, 100)}%`,
							}}
						/>
					</div>
					<p className="text-xs text-zinc-500 mt-2">
						{Math.round((targets.steps / targets.estimatedDailySteps) * 100)}%
						of daily goal
					</p>
				</div>
			</div>
		</div>
	);
}

function MacroCard({ label, amount }: { label: string; amount: number }) {
	return (
		<div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
			<p className="text-zinc-400 text-xs mb-1">{label}</p>
			<p className="text-xl font-bold">{amount}g</p>
			{/* <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
				<div className={`h-full ${color} w-0`} />
			</div> */}
		</div>
	);
}
