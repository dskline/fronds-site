import type { VanillaWowClass } from "../../types";
import ClassInterestItem from "./ClassInterestItem";

interface AvailableClassesProps {
	unselectedClasses: VanillaWowClass[];
	onToggle: (wowClass: VanillaWowClass) => void;
}

export default function AvailableClasses({
	unselectedClasses,
	onToggle,
}: AvailableClassesProps) {
	if (unselectedClasses.length === 0) return null;

	return (
		<div>
			<h3 className="text-lg font-semibold mb-3">Available Classes</h3>
			<div className="space-y-2">
				{unselectedClasses.map((wowClass) => (
					<ClassInterestItem
						key={wowClass}
						wowClass={wowClass}
						isSelected={false}
						onToggle={onToggle}
					/>
				))}
			</div>
		</div>
	);
}
