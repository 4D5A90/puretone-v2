import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { DietService } from "../services/DietService";
import { ActivityRepository } from "../services/storage/ActivityRepository";
import { storage } from "../services/storage/LocalStorageAdapter";
import {
	ScheduledWorkoutRepository,
	type ScheduledWorkout,
} from "../services/storage/ScheduledWorkoutRepository";
import { WorkoutTemplateRepository } from "../services/storage/WorkoutTemplateRepository";
import { Play } from "lucide-react";

const activityRepo = new ActivityRepository(storage);
const dietService = new DietService(activityRepo);
const scheduledRepo = new ScheduledWorkoutRepository(storage);
const templateRepo = new WorkoutTemplateRepository(storage);

import type { ActivityLog } from "../services/storage/ActivityRepository";

export default function DashboardPage() {
	const navigate = useNavigate();
	const profile = useUserStore((state) => state.profile);
	const [data, setData] = useState<{
		macros: {
			calories: number;
			protein: number;
			carbs: number;
			fats: number;
		};
		totalTDEE: number;
		stepCalories: number;
		steps: number;
		logs: ActivityLog[];
	} | null>(null);
	const [todayWorkout, setTodayWorkout] = useState<ScheduledWorkout | null>(
		null,
	);

	const loadTargets = useCallback(async () => {
		if (profile) {
			const targets = await dietService.getDailyTargets(profile);
			setData(targets);
		}
	}, [profile]);

	const loadTodayWorkout = useCallback(async () => {
		const workout = await scheduledRepo.getTodayWorkout();
		setTodayWorkout(workout);
	}, []);

	useEffect(() => {
		loadTargets();
		loadTodayWorkout();
	}, [loadTargets, loadTodayWorkout]);

	if (!profile || !data)
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
					<p className="text-zinc-400 text-sm mb-1">Daily Target</p>
					<h2 className="text-4xl font-bold text-white">
						{data.totalTDEE} <span className="text-lg text-zinc-500">kcal</span>
					</h2>
				</div>
				<div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 col-span-2">
					<div className="flex justify-between items-center mb-2">
						<div>
							<p className="text-zinc-400 text-xs">Activity</p>
							<p className="text-xl font-bold text-white">{data.steps} steps</p>
						</div>
						<div className="text-right">
							<p className="text-green-500 font-bold">
								+{data.stepCalories} kcal
							</p>
						</div>
					</div>

					{data.logs.length > 0 && (
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
												+{log.amount} {log.type}
											</span>
										</div>
									))}
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="grid grid-cols-3 gap-4">
				<MacroCard
					label="Protein"
					amount={data.macros.protein}
					color="bg-red-500"
				/>
				<MacroCard
					label="Carbs"
					amount={data.macros.carbs}
					color="bg-yellow-500"
				/>
				<MacroCard
					label="Fats"
					amount={data.macros.fats}
					color="bg-green-500"
				/>
			</div>
		</div>
	);
}

function MacroCard({
	label,
	amount,
	color,
}: { label: string; amount: number; color: string }) {
	return (
		<div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
			<p className="text-zinc-400 text-xs mb-1">{label}</p>
			<p className="text-xl font-bold mb-2">{amount}g</p>
			<div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
				<div className={`h-full ${color} w-0`} />
			</div>
		</div>
	);
}
