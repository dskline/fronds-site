import type { VanillaWowClass } from "../../types";
import ClassInterestItem from "./ClassInterestItem";

interface SelectedClassesProps {
	selectedClasses: VanillaWowClass[];
	onToggle: (wowClass: VanillaWowClass) => void;
	onMoveUp: (wowClass: VanillaWowClass) => void;
	onMoveDown: (wowClass: VanillaWowClass) => void;
	// spec selection
	getClassSpec?: (wowClass: VanillaWowClass) => string | null;
	onSpecChange?: (
		wowClass: VanillaWowClass,
		specId: string | undefined,
	) => void;
}

export default function SelectedClasses({
	selectedClasses,
	onToggle,
	onMoveUp,
	onMoveDown,
	getClassSpec,
	onSpecChange,
}: SelectedClassesProps) {
	if (selectedClasses.length === 0) return null;

	return (
		<div>
			<h3 className="text-lg font-semibold  mb-3">Selected Classes</h3>
			<div className="space-y-2">
				{selectedClasses.map((wowClass, index) => (
					<ClassInterestItem
						key={wowClass}
						wowClass={wowClass}
						isSelected={true}
						onToggle={onToggle}
						onMoveUp={() => onMoveUp(wowClass)}
						onMoveDown={() => onMoveDown(wowClass)}
						canMoveUp={index > 0}
						canMoveDown={index < selectedClasses.length - 1}
						selectedSpecId={getClassSpec?.(wowClass) ?? null}
						onSpecChange={onSpecChange}
					/>
				))}
			</div>
		</div>
	);
}
