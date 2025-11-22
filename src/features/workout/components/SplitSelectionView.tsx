import type { SplitType } from "../WorkoutGenerator";

const SPLIT_OPTIONS: { id: SplitType; label: string; description: string }[] = [
	{ id: "ppl", label: "Push/Pull/Legs", description: "3-6 days/week" },
	{ id: "upper_lower", label: "Upper/Lower", description: "2-4 days/week" },
	{ id: "full_body", label: "Full Body", description: "2-3 days/week" },
	{ id: "custom", label: "Custom", description: "Design your own" },
];

interface SplitSelectionViewProps {
	selectedSplit: SplitType | null;
	onSelectSplit: (split: SplitType) => void;
	daysPerWeek: number;
	setDaysPerWeek: (days: number) => void;
	onGenerate: () => void;
}

export function SplitSelectionView({
	selectedSplit,
	onSelectSplit,
	daysPerWeek,
	setDaysPerWeek,
	onGenerate,
}: SplitSelectionViewProps) {
	return (
		<div className="flex-1 flex flex-col gap-4">
			<div className="grid grid-cols-2 gap-4">
				{SPLIT_OPTIONS.map((split) => (
					<button
						key={split.id}
						type="button"
						onClick={() => onSelectSplit(split.id)}
						className={`bg-zinc-900 p-6 rounded-xl border transition-colors text-left ${
							selectedSplit === split.id
								? "border-blue-500 bg-blue-900/20"
								: "border-zinc-800 hover:border-blue-500"
						}`}
					>
						<h3 className="font-bold text-lg mb-1">{split.label}</h3>
						<p className="text-sm text-zinc-400">{split.description}</p>
					</button>
				))}
			</div>

			{selectedSplit && selectedSplit !== "custom" && (
				<div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
					<label
						htmlFor="days-per-week"
						className="block mb-2 text-sm font-medium"
					>
						Days per week
					</label>
					<input
						id="days-per-week"
						type="number"
						value={daysPerWeek}
						onChange={(e) =>
							setDaysPerWeek(Number.parseInt(e.target.value) || 3)
						}
						min="1"
						max="7"
						className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white"
					/>
					<button
						type="button"
						onClick={onGenerate}
						className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors"
					>
						Generate Schedule
					</button>
				</div>
			)}
		</div>
	);
}
