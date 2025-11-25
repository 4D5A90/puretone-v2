import type React from "react";
import { Trash2 } from "lucide-react";

interface SetConfigurationProps {
	setNumber: number;
	reps: number;
	onRepsChange: (reps: number) => void;
	onRemove: () => void;
}

export const SetConfiguration: React.FC<SetConfigurationProps> = ({
	setNumber,
	reps,
	onRepsChange,
	onRemove,
}) => {
	return (
		<div className="flex items-center gap-2 text-sm">
			<span className="text-zinc-500 w-8">#{setNumber}</span>
			<div className="flex items-center gap-2 bg-zinc-800 rounded px-2 py-1 flex-1">
				<span className="text-zinc-400 text-xs">Reps</span>
				<input
					type="number"
					value={reps}
					onChange={(e) => onRepsChange(Number.parseInt(e.target.value) || 0)}
					className="bg-transparent text-white w-full outline-none text-right font-mono"
					min={1}
					max={100}
				/>
			</div>
			<button
				type="button"
				onClick={onRemove}
				className="text-zinc-600 hover:text-red-400 transition-colors p-1"
			>
				<Trash2 size={14} />
			</button>
		</div>
	);
};
