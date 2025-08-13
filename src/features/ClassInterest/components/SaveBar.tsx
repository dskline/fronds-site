interface SaveBarProps {
	onSave: () => void | Promise<void>;
	isSaving: boolean;
	saveMessage: string;
}

export default function SaveBar({
	onSave,
	isSaving,
	saveMessage,
}: SaveBarProps) {
	return (
		<div className="flex items-center space-x-4">
			<button
				type="button"
				onClick={onSave}
				disabled={isSaving}
				className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				{isSaving ? "Saving..." : "Save Interests"}
			</button>
			{saveMessage && (
				<span
					className={`text-sm font-medium ${saveMessage.startsWith("✓") ? "text-green-600" : "text-red-600"}`}
				>
					{saveMessage}
				</span>
			)}
		</div>
	);
}
