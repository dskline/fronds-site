import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClassInterest from "src/features/ClassInterest";
import type { CharacterInterest } from "src/features/ClassInterest/types";
import type { DiscordUser } from "src/features/DiscordAuth/schema";

async function fetchCharacterInterests(
	discordId: string,
): Promise<CharacterInterest[]> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const response = await fetch(
			`${baseUrl}/api/profile/${discordId}/character_interests`,
			{
				headers: {
					"Cache-Control": "no-cache",
				},
			},
		);

		if (!response.ok) {
			console.error(
				"Failed to fetch character interests:",
				response.statusText,
			);
			return [];
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching character interests:", error);
		return [];
	}
}

export default async function InterestPage() {
	const cookieStore = await cookies();
	const raw = cookieStore.get("discord_user")?.value;
	let discordUser: DiscordUser | undefined;

	if (raw) {
		try {
			discordUser = JSON.parse(raw);
		} catch {
			// ignore JSON parse errors
		}
	}

	// Redirect to home if not logged in
	if (!discordUser) {
		redirect("/");
	}

	const characterInterests = await fetchCharacterInterests(discordUser.id);

	return (
		<div className="min-h-screen py-12">
			<ClassInterest
				discordId={discordUser.id}
				initialInterests={characterInterests}
			/>
		</div>
	);
}
