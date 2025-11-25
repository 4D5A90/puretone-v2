import { useState } from "react";
import { Reorder } from "framer-motion";
import clsx from "clsx";
import { MuscleCard } from "./MuscleCard";
import type { ColumnId } from "../../../hooks/useCustomSplit";
import type { MuscleGroup } from "../ExerciseDatabase";
import { ChevronRight, ChevronLeft } from "lucide-react";

const COLUMNS: { id: ColumnId; label: string; color: string }[] = [
	{ id: "available", label: "Available", color: "bg-zinc-800" },
	{ id: "high", label: "High Focus", color: "bg-red-900/20 border-red-500/50" },
	{
		id: "medium",
		label: "Medium Focus",
		color: "bg-yellow-900/20 border-yellow-500/50",
	},
	{
		id: "low",
		label: "Low Focus",
		color: "bg-green-900/20 border-green-500/50",
	},
];

interface CustomSplitConfigurationProps {
	customSplitType: "single" | "ppl" | "upper_lower" | "full_body";
	setCustomSplitType: (
		type: "single" | "ppl" | "upper_lower" | "full_body",
	) => void;
	daysPerWeek: number;
	setDaysPerWeek: (days: number) => void;
	currentCustomDay: number;
	setCurrentCustomDay: (day: number) => void;
	repRanges: {
		compound: { min: number; max: number };
		isolation: { min: number; max: number };
	};
	setRepRanges: (ranges: any) => void;
	currentColumns: Record<ColumnId, MuscleGroup[]>;
	updateCurrentColumns: (cols: Record<ColumnId, MuscleGroup[]>) => void;
	moveMuscle: (muscle: MuscleGroup, targetCol: ColumnId) => void;
	onGenerate: () => void;
	hasSelection: boolean;
}

export function CustomSplitConfiguration({
	daysPerWeek,
	setDaysPerWeek,
	repRanges,
	setRepRanges,
	currentColumns,
	updateCurrentColumns,
	moveMuscle,
	onGenerate,
	hasSelection,
}: Omit<
	CustomSplitConfigurationProps,
	| "customSplitType"
	| "setCustomSplitType"
	| "currentCustomDay"
	| "setCurrentCustomDay"
>) {
	const [step, setStep] = useState<1 | 2>(1);

	if (step === 1) {
		return (
			<div className="flex-1 flex flex-col gap-4 overflow-y-auto p-4">
				<h2 className="text-xl font-bold">Configuration</h2>

				{/* Days per week */}
				<div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
					<label
						htmlFor="custom-days-per-week"
						className="block mb-2 text-sm font-medium"
					>
						Days per week
					</label>
					<input
						id="custom-days-per-week"
						type="number"
						value={daysPerWeek}
						onChange={(e) =>
							setDaysPerWeek(Number.parseInt(e.target.value) || 1)
						}
						min="1"
						max="7"
						className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white"
					/>
				</div>

				{/* Rep Range Configuration */}
				<div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
					<h3 className="font-medium text-sm mb-3">Rep Ranges</h3>
					<div className="space-y-3">
						<div>
							<label className="block mb-2 text-sm text-zinc-400">
								Compound Exercises
							</label>
							<div className="flex gap-2 items-center">
								<input
									type="number"
									value={repRanges.compound.min}
									onChange={(e) =>
										setRepRanges((prev: any) => ({
											...prev,
											compound: {
												...prev.compound,
												min: Number.parseInt(e.target.value) || 1,
											},
										}))
									}
									min="1"
									max="30"
									className="w-20 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
								/>
								<span className="text-zinc-500">to</span>
								<input
									type="number"
									value={repRanges.compound.max}
									onChange={(e) =>
										setRepRanges((prev: any) => ({
											...prev,
											compound: {
												...prev.compound,
												max: Number.parseInt(e.target.value) || 1,
											},
										}))
									}
									min="1"
									max="30"
									className="w-20 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
								/>
								<span className="text-zinc-500 text-sm">reps</span>
							</div>
						</div>
						<div>
							<label className="block mb-2 text-sm text-zinc-400">
								Isolation Exercises
							</label>
							<div className="flex gap-2 items-center">
								<input
									type="number"
									value={repRanges.isolation.min}
									onChange={(e) =>
										setRepRanges((prev: any) => ({
											...prev,
											isolation: {
												...prev.isolation,
												min: Number.parseInt(e.target.value) || 1,
											},
										}))
									}
									min="1"
									max="30"
									className="w-20 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
								/>
								<span className="text-zinc-500">to</span>
								<input
									type="number"
									value={repRanges.isolation.max}
									onChange={(e) =>
										setRepRanges((prev: any) => ({
											...prev,
											isolation: {
												...prev.isolation,
												max: Number.parseInt(e.target.value) || 1,
											},
										}))
									}
									min="1"
									max="30"
									className="w-20 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
								/>
								<span className="text-zinc-500 text-sm">reps</span>
							</div>
						</div>
					</div>
				</div>

				<button
					type="button"
					onClick={() => setStep(2)}
					className="mt-auto w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
				>
					Next: Configure Focus <ChevronRight size={20} />
				</button>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col gap-4 overflow-hidden">
			{/* Header with Back button */}
			<div className="flex-none px-4 pt-2 flex items-center gap-2">
				<button
					type="button"
					onClick={() => setStep(1)}
					className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
				>
					<ChevronLeft size={24} />
				</button>
				<h2 className="text-xl font-bold">Configure Focus</h2>
			</div>

			<div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4 px-4">
				{COLUMNS.map((col) => (
					<div
						key={col.id}
						className={clsx(
							"flex-none w-full flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50",
							col.color,
						)}
					>
						<div className="p-3 border-b border-zinc-800 font-bold text-sm sticky top-0 bg-inherit rounded-t-xl z-10">
							{col.label}
						</div>
						<div className="p-3 flex-1 overflow-y-auto space-y-2 min-h-[100px]">
							<Reorder.Group
								axis="y"
								values={currentColumns[col.id]}
								onReorder={(newOrder) =>
									updateCurrentColumns({
										...currentColumns,
										[col.id]: newOrder,
									})
								}
								className="space-y-2 min-h-[50px]"
							>
								{currentColumns[col.id].map((muscleId) => (
									<MuscleCard
										key={muscleId}
										muscleId={muscleId}
										currentCol={col.id}
										onMove={moveMuscle}
									/>
								))}
							</Reorder.Group>
							{currentColumns[col.id].length === 0 && (
								<div className="h-20 border-2 border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-xs">
									Drop here
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			<div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex-none mx-4 mb-4">
				<button
					type="button"
					onClick={onGenerate}
					disabled={!hasSelection}
					className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-4 rounded-xl transition-colors"
				>
					Generate Schedule
				</button>
			</div>
		</div>
	);
}
