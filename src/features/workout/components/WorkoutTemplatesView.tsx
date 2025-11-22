import type { WorkoutTemplate } from "../../../services/storage/WorkoutTemplateRepository";

interface WorkoutTemplatesViewProps {
	templates: WorkoutTemplate[];
	onSelect: (template: WorkoutTemplate) => void;
	onClose: () => void;
}

export function WorkoutTemplatesView({
	templates,
	onSelect,
	onClose,
}: WorkoutTemplatesViewProps) {
	return (
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
			<div className="bg-zinc-900 rounded-xl p-6 max-w-2xl w-full border border-zinc-800 max-h-[80vh] overflow-y-auto">
				<h2 className="text-xl font-bold mb-4">Load Template</h2>
				{templates.length === 0 ? (
					<p className="text-zinc-400 text-center py-8">
						No templates saved yet
					</p>
				) : (
					<div className="space-y-3">
						{templates.map((template) => (
							<button
								key={template.id}
								type="button"
								onClick={() => onSelect(template)}
								className="w-full bg-zinc-800 hover:bg-zinc-700 p-4 rounded-lg text-left transition-colors"
							>
								<div className="flex justify-between items-start mb-2">
									<h3 className="font-bold text-lg">{template.templateName}</h3>
									<span className="text-sm text-zinc-400">
										{template.days.length} day
										{template.days.length > 1 ? "s" : ""}
									</span>
								</div>
								<div className="flex gap-2 text-sm text-zinc-400">
									<span className="capitalize">
										{template.splitType.replace("_", " ")}
									</span>
									<span>•</span>
									<span>
										{new Date(template.createdAt).toLocaleDateString()}
									</span>
								</div>
							</button>
						))}
					</div>
				)}
				<button
					type="button"
					onClick={onClose}
					className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg"
				>
					Close
				</button>
			</div>
		</div>
	);
}
