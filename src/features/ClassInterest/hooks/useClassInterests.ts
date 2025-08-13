import { useMemo, useState } from "react";
import { getRankBetween } from "../lexorank";
import type { CharacterInterest, VanillaWowClass } from "../types";
import { VANILLA_WOW_CLASSES } from "../types";

export function useClassInterests(
	discordId: string,
	initialInterests: CharacterInterest[],
) {
	const [interests, setInterests] =
		useState<CharacterInterest[]>(initialInterests);
	const [isSaving, setIsSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState<string>("");

	const interestMap = useMemo(
		() => new Map(interests.map((interest) => [interest.class, interest])),
		[interests],
	);

	const selectedClasses = useMemo(
		() =>
			interests
				.sort((a, b) => a.lexorank.localeCompare(b.lexorank))
				.map((interest) => interest.class as VanillaWowClass),
		[interests],
	);

	const unselectedClasses = useMemo(
		() => VANILLA_WOW_CLASSES.filter((wowClass) => !interestMap.has(wowClass)),
		[interestMap],
	);

	const handleClassToggle = (wowClass: VanillaWowClass) => {
		const existingInterest = interestMap.get(wowClass);

		if (existingInterest) {
			setInterests((prev) =>
				prev.filter((interest) => interest.class !== wowClass),
			);
		} else {
			const sortedInterests = interests.sort((a, b) =>
				a.lexorank.localeCompare(b.lexorank),
			);

			const lastRank =
				sortedInterests.length > 0
					? sortedInterests[sortedInterests.length - 1].lexorank
					: null;
			const newRank = getRankBetween(lastRank, null);

			const newInterest: CharacterInterest = {
				id: Date.now(),
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

		const sortedInterests = [...interests].sort((a, b) =>
			a.lexorank.localeCompare(b.lexorank),
		);

		const targetIndex = currentIndex - 1;

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

		const sortedInterests = [...interests].sort((a, b) =>
			a.lexorank.localeCompare(b.lexorank),
		);

		const targetIndex = currentIndex + 1;

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

	return {
		interests,
		selectedClasses,
		unselectedClasses,
		isSaving,
		saveMessage,
		handleClassToggle,
		handleMoveUp,
		handleMoveDown,
		handleSave,
	};
}
