import { cookies } from "next/headers";
import type { DiscordUser } from "src/features/DiscordAuth/schema";
import { ProfileActions } from "src/features/layout/Navbar/ProfileActions";

export async function ProfileActionsContainer() {
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

	return <ProfileActions discordUser={discordUser} />;
}
