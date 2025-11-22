interface SaveTemplateModalProps {
	templateName: string;
	setTemplateName: (name: string) => void;
	onConfirm: () => void;
	onCancel: () => void;
}

export function SaveTemplateModal({
	templateName,
	setTemplateName,
	onConfirm,
	onCancel,
}: SaveTemplateModalProps) {
	return (
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
			<div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full border border-zinc-800">
				<h2 className="text-xl font-bold mb-4">Save as Template</h2>
				<input
					type="text"
					value={templateName}
					onChange={(e) => setTemplateName(e.target.value)}
					placeholder="Template name..."
					className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white mb-4"
				/>
				<div className="flex gap-3">
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={!templateName.trim()}
						className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
