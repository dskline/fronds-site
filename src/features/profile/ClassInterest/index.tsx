"use client";

import type { CharacterInterest } from "../types";
import AvailableClasses from "./components/AvailableClasses";
import ClassInterestHeader from "./components/ClassInterestHeader";
import SaveBar from "./components/SaveBar";
import SelectedClasses from "./components/SelectedClasses";
import { useClassInterests } from "./hooks/useClassInterests";

interface ClassInterestProps {
	discordId: string;
	initialInterests: CharacterInterest[];
}

export default function ClassInterest({
	discordId,
	initialInterests,
}: ClassInterestProps) {
	const {
		selectedClasses,
		unselectedClasses,
		isSaving,
		saveMessage,
		handleClassToggle,
		handleMoveUp,
		handleMoveDown,
		handleSave,
		handleSpecChange,
		getClassSpec,
	} = useClassInterests(discordId, initialInterests);

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			<ClassInterestHeader />

			<SelectedClasses
				selectedClasses={selectedClasses}
				onToggle={handleClassToggle}
				onMoveUp={handleMoveUp}
				onMoveDown={handleMoveDown}
				getClassSpec={getClassSpec}
				onSpecChange={handleSpecChange}
			/>

			<AvailableClasses
				unselectedClasses={unselectedClasses}
				onToggle={handleClassToggle}
			/>

			<SaveBar
				onSave={handleSave}
				isSaving={isSaving}
				saveMessage={saveMessage}
			/>
		</div>
	);
}
