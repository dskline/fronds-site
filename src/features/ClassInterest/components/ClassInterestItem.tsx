import type { VanillaWowClass } from "../types";
import { VANILLA_CLASS_SPECS } from "../types";

interface ClassInterestItemProps {
	wowClass: VanillaWowClass;
	isSelected: boolean;
	onToggle: (wowClass: VanillaWowClass) => void;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
	canMoveUp?: boolean;
	canMoveDown?: boolean;
	// spec handling
	selectedSpecId?: string | null;
	onSpecChange?: (wowClass: VanillaWowClass, specId: string | undefined) => void;
}

export default function ClassInterestItem({
	wowClass,
	isSelected,
	onToggle,
	onMoveUp,
	onMoveDown,
	canMoveUp,
	canMoveDown,
	selectedSpecId,
	onSpecChange,
}: ClassInterestItemProps) {
	return (
		<div className="flex items-center space-x-3 bg-white p-3 border rounded-lg shadow-sm">
			<input
				type="checkbox"
				checked={isSelected}
				onChange={() => onToggle(wowClass)}
				className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
			/>
			<span
				className={`flex-1 text-sm font-medium ${isSelected ? "text-gray-900" : "text-gray-500"}`}
			>
				{wowClass}
			</span>
			{isSelected && (
				<select
					className="text-sm font-medium text-gray-900 border rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
					value={selectedSpecId ?? ""}
					onChange={(e) => onSpecChange?.(wowClass, e.target.value === "" ? undefined : e.target.value)}
				>
					<option value="">Flex</option>
					{VANILLA_CLASS_SPECS[wowClass].map((opt) => (
						<option key={opt.id} value={opt.id}>
							{opt.label}
						</option>
					))}
				</select>
			)}
			{isSelected && (onMoveUp || onMoveDown) && (
				<div className="flex space-x-1">
					<button
						type="button"
						onClick={onMoveUp}
						disabled={!canMoveUp}
						className="p-1 text-gray-800 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
						title="Move up"
					>
						<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<title>Move up</title>
							<path
								fillRule="evenodd"
								d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
					<button
						type="button"
						onClick={onMoveDown}
						disabled={!canMoveDown}
						className="p-1 text-gray-800 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
						title="Move down"
					>
						<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<title>Move down</title>
							<path
								fillRule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			)}
		</div>
	);
}
