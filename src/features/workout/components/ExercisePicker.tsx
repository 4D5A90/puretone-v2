import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { MUSCLE_GROUPS } from "../../../hooks/useCustomSplit";
import type { Exercise, MuscleGroup } from "../ExerciseDatabase";

interface ExercisePickerProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (exercise: Exercise) => void;
	exercises: Exercise[];
}

export const ExercisePicker: React.FC<ExercisePickerProps> = ({
	isOpen,
	onClose,
	onSelect,
	exercises,
}) => {
	const [search, setSearch] = useState("");
	const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "all">(
		"all",
	);

	const filteredExercises = useMemo(() => {
		return exercises.filter((ex) => {
			const matchesSearch = ex.name
				.toLowerCase()
				.includes(search.toLowerCase());
			const matchesMuscle =
				selectedMuscle === "all" || ex.targetMuscles.includes(selectedMuscle);
			return matchesSearch && matchesMuscle;
		});
	}, [exercises, search, selectedMuscle]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				className="bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-800 flex flex-col max-h-[80vh]"
			>
				<div className="p-4 border-b border-zinc-800 flex items-center justify-between">
					<h2 className="text-lg font-bold text-white">Add Exercise</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-zinc-400 hover:text-white"
					>
						<X size={24} />
					</button>
				</div>

				<div className="p-4 border-b border-zinc-800 space-y-4">
					<div className="relative">
						<Search
							className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
							size={18}
						/>
						<input
							type="text"
							placeholder="Search exercises..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
						/>
					</div>

					<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
						<button
							type="button"
							onClick={() => setSelectedMuscle("all")}
							className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
								selectedMuscle === "all"
									? "bg-blue-600 text-white"
									: "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
							}`}
						>
							All Muscles
						</button>
						{MUSCLE_GROUPS.map((m) => (
							<button
								key={m.id}
								type="button"
								onClick={() => setSelectedMuscle(m.id)}
								className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
									selectedMuscle === m.id
										? "bg-blue-600 text-white"
										: "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
								}`}
							>
								{m.label}
							</button>
						))}
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-4 space-y-2">
					{filteredExercises.map((exercise) => (
						<button
							key={exercise.id}
							type="button"
							onClick={() => {
								onSelect(exercise);
								onClose();
							}}
							className="w-full text-left bg-zinc-950 hover:bg-zinc-800 border border-zinc-800/50 p-3 rounded-xl transition-colors group"
						>
							<div className="flex justify-between items-start">
								<div>
									<h3 className="font-medium text-zinc-200 group-hover:text-blue-400 transition-colors">
										{exercise.name}
									</h3>
									<p className="text-xs text-zinc-500 mt-1 capitalize">
										{exercise.targetMuscles.join(", ")} • {exercise.equipment}
									</p>
								</div>
								<span
									className={`text-[10px] px-2 py-0.5 rounded border ${
										exercise.difficulty === "beginner"
											? "border-green-900 text-green-500 bg-green-900/20"
											: exercise.difficulty === "intermediate"
												? "border-yellow-900 text-yellow-500 bg-yellow-900/20"
												: "border-red-900 text-red-500 bg-red-900/20"
									}`}
								>
									{exercise.difficulty}
								</span>
							</div>
						</button>
					))}

					{filteredExercises.length === 0 && (
						<div className="text-center py-8 text-zinc-500">
							No exercises found
						</div>
					)}
				</div>
			</motion.div>
		</div>
	);
};
