import type React from "react";
import { motion } from "framer-motion";
import type { MuscleGroup } from "../ExerciseDatabase";
import { clsx } from "clsx";

interface VolumeBudgetProps {
	volumeTargets: Partial<Record<MuscleGroup, { min: number; max: number }>>;
	currentVolume: Partial<Record<MuscleGroup, number>>;
}

export const VolumeBudget: React.FC<VolumeBudgetProps> = ({
	volumeTargets,
	currentVolume,
}) => {
	const muscles = Object.keys(volumeTargets) as MuscleGroup[];

	if (muscles.length === 0) return null;

	return (
		<div className="bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 p-4 sticky top-0 z-10">
			<h3 className="text-sm font-medium text-zinc-400 mb-3">
				Volume Budget (Weekly Sets)
			</h3>
			<div className="grid grid-cols-2 gap-3">
				{muscles.map((muscle) => {
					const target = volumeTargets[muscle] || { min: 0, max: 0 };
					const current = currentVolume[muscle] || 0;
					const progress =
						target.max > 0 ? Math.min(100, (current / target.max) * 100) : 0;

					// Status colors
					let statusColor = "bg-blue-500";
					if (current < target.min)
						statusColor = "bg-yellow-500"; // Under
					else if (current > target.max)
						statusColor = "bg-red-500"; // Over
					else statusColor = "bg-green-500"; // Optimal

					return (
						<div key={muscle} className="flex flex-col gap-1 w-full">
							<div className="flex justify-between text-xs">
								<span className="capitalize text-zinc-300">{muscle}</span>
								<span
									className={clsx(
										"font-mono",
										current < target.min && "text-yellow-500",
										current >= target.min &&
											current <= target.max &&
											"text-green-500",
										current > target.max && "text-red-500",
									)}
								>
									{current} / {target.min}-{target.max}
								</span>
							</div>
							<div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
								<motion.div
									className={clsx("h-full rounded-full", statusColor)}
									initial={{ width: 0 }}
									animate={{ width: `${progress}%` }}
									transition={{ duration: 0.5 }}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
