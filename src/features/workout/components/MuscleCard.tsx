import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { MUSCLE_GROUPS, type ColumnId } from "../../../hooks/useCustomSplit";
import type { MuscleGroup } from "../ExerciseDatabase";

interface MuscleCardProps {
	muscleId: MuscleGroup;
	currentCol: ColumnId;
	onMove: (m: MuscleGroup, c: ColumnId) => void;
}

export function MuscleCard({ muscleId, currentCol, onMove }: MuscleCardProps) {
	const label = MUSCLE_GROUPS.find((m) => m.id === muscleId)?.label || muscleId;
	const controls = useDragControls();

	return (
		<Reorder.Item
			value={muscleId}
			dragListener={false}
			dragControls={controls}
			className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 shadow-sm flex justify-between items-center group select-none cursor-grab active:cursor-grabbing"
		>
			<span className="font-medium">{label}</span>
			<div className="flex items-center gap-2">
				{/* Quick move buttons */}
				<div className="flex gap-1">
					{currentCol !== "available" && (
						<button
							type="button"
							onClick={() => onMove(muscleId, "available")}
							className="text-[10px] bg-zinc-700 px-1 rounded text-zinc-300"
						>
							x
						</button>
					)}
					{currentCol === "available" && (
						<>
							<button
								type="button"
								onClick={() => onMove(muscleId, "high")}
								className="w-4 h-4 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-[10px]"
							>
								H
							</button>
							<button
								type="button"
								onClick={() => onMove(muscleId, "medium")}
								className="w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-[10px]"
							>
								M
							</button>
							<button
								type="button"
								onClick={() => onMove(muscleId, "low")}
								className="w-4 h-4 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-[10px]"
							>
								L
							</button>
						</>
					)}
				</div>
				<div
					onPointerDown={(e) => controls.start(e)}
					className="text-zinc-500 hover:text-zinc-300"
				>
					<GripVertical size={16} />
				</div>
			</div>
		</Reorder.Item>
	);
}
