"use client";

import { useState } from "react";
import { getRankBetween } from "./lexorank";
import type { CharacterInterest, VanillaWowClass } from "./types";
import { VANILLA_WOW_CLASSES } from "./types";

interface ClassInterestItemProps {
	wowClass: VanillaWowClass;
	isSelected: boolean;
	onToggle: (wowClass: VanillaWowClass) => void;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
	canMoveUp?: boolean;
	canMoveDown?: boolean;
}

function ClassInterestItem({
	wowClass,
	isSelected,
	onToggle,
	onMoveUp,
	onMoveDown,
	canMoveUp,
	canMoveDown,
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

interface ClassInterestProps {
	discordId: string;
	initialInterests: CharacterInterest[];
}

export default function ClassInterest({
	discordId,
	initialInterests,
}: ClassInterestProps) {
	const [interests, setInterests] =
		useState<CharacterInterest[]>(initialInterests);
	const [isSaving, setIsSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState<string>("");

	// Create a map of class to interest for easy lookup
	const interestMap = new Map(
		interests.map((interest) => [interest.class, interest]),
	);

	// Separate selected and unselected classes
	const selectedClasses = interests
		.sort((a, b) => a.lexorank.localeCompare(b.lexorank))
		.map((interest) => interest.class as VanillaWowClass);

	const unselectedClasses = VANILLA_WOW_CLASSES.filter(
		(wowClass) => !interestMap.has(wowClass),
	);

	const handleClassToggle = (wowClass: VanillaWowClass) => {
		const existingInterest = interestMap.get(wowClass);

		if (existingInterest) {
			// Remove the interest
			setInterests((prev) =>
				prev.filter((interest) => interest.class !== wowClass),
			);
		} else {
			// Add new interest at the bottom with appropriate lexorank
			const sortedInterests = interests.sort((a, b) =>
				a.lexorank.localeCompare(b.lexorank),
			);

			// Get the last rank and create a new rank after it
			const lastRank =
				sortedInterests.length > 0
					? sortedInterests[sortedInterests.length - 1].lexorank
					: null;
			const newRank = getRankBetween(lastRank, null);

			const newInterest: CharacterInterest = {
				id: Date.now(), // Temporary ID
				discord_id: discordId,
				class: wowClass,
				spec: null,
				lexorank: newRank,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			setInterests((prev) => [...prev, newInterest]);
		}
	};

	const handleMoveUp = (wowClass: VanillaWowClass) => {
		const currentIndex = selectedClasses.indexOf(wowClass);
		if (currentIndex <= 0) return;

		// Get the current sorted list
		const sortedInterests = [...interests].sort((a, b) =>
			a.lexorank.localeCompare(b.lexorank),
		);

		// Find the target position (one up from current)
		const targetIndex = currentIndex - 1;

		// Calculate new rank between the item before the target and the target
		const beforeTargetRank =
			targetIndex > 0 ? sortedInterests[targetIndex - 1].lexorank : null;
		const targetRank = sortedInterests[targetIndex].lexorank;

		const newRank = getRankBetween(beforeTargetRank, targetRank);

		setInterests((prev) =>
			prev.map((interest) =>
				interest.class === wowClass
					? { ...interest, lexorank: newRank }
					: interest,
			),
		);
	};

	const handleMoveDown = (wowClass: VanillaWowClass) => {
		const currentIndex = selectedClasses.indexOf(wowClass);
		if (currentIndex >= selectedClasses.length - 1) return;

		// Get the current sorted list
		const sortedInterests = [...interests].sort((a, b) =>
			a.lexorank.localeCompare(b.lexorank),
		);

		// Find the target position (one down from current)
		const targetIndex = currentIndex + 1;

		// Calculate new rank between the target and the item after the target
		const targetRank = sortedInterests[targetIndex].lexorank;
		const afterTargetRank =
			targetIndex < sortedInterests.length - 1
				? sortedInterests[targetIndex + 1].lexorank
				: null;

		const newRank = getRankBetween(targetRank, afterTargetRank);

		setInterests((prev) =>
			prev.map((interest) =>
				interest.class === wowClass
					? { ...interest, lexorank: newRank }
					: interest,
			),
		);
	};

	const handleSave = async () => {
		setIsSaving(true);
		setSaveMessage("");

		try {
			const response = await fetch(
				`/api/profile/${discordId}/character_interests`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						interests: interests.map((interest) => ({
							class: interest.class,
							spec: interest.spec,
							lexorank: interest.lexorank,
						})),
					}),
				},
			);

			if (!response.ok) {
				throw new Error("Failed to save interests");
			}

			setSaveMessage("✓ Interests saved successfully!");
			setTimeout(() => setSaveMessage(""), 3000);
		} catch (error) {
			console.error("Error saving interests:", error);
			setSaveMessage("❌ Failed to save interests");
			setTimeout(() => setSaveMessage(""), 3000);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			<div>
				<h2 className="text-2xl font-bold mb-2">Class Interests</h2>
				<p>
					Select and reorder your preferred WoW classes. Use the arrow buttons
					to reorder selected items.
				</p>
			</div>

			{/* Selected Classes */}
			{selectedClasses.length > 0 && (
				<div>
					<h3 className="text-lg font-semibold  mb-3">Selected Classes</h3>
					<div className="space-y-2">
						{selectedClasses.map((wowClass, index) => (
							<ClassInterestItem
								key={wowClass}
								wowClass={wowClass}
								isSelected={true}
								onToggle={handleClassToggle}
								onMoveUp={() => handleMoveUp(wowClass)}
								onMoveDown={() => handleMoveDown(wowClass)}
								canMoveUp={index > 0}
								canMoveDown={index < selectedClasses.length - 1}
							/>
						))}
					</div>
				</div>
			)}

			{/* Unselected Classes */}
			{unselectedClasses.length > 0 && (
				<div>
					<h3 className="text-lg font-semibold mb-3">Available Classes</h3>
					<div className="space-y-2">
						{unselectedClasses.map((wowClass) => (
							<ClassInterestItem
								key={wowClass}
								wowClass={wowClass}
								isSelected={false}
								onToggle={handleClassToggle}
							/>
						))}
					</div>
				</div>
			)}

			{/* Save Button and Message */}
			<div className="flex items-center space-x-4">
				<button
					type="button"
					onClick={handleSave}
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
		</div>
	);
}
