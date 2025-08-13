import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { DiscordUser } from "src/features/DiscordAuth/schema";
import { ProfileSelect } from "src/features/profile/ProfileSelect";

export default async function ProfilePage() {
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

	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-6">
					Character Profile
				</h1>
				<div className="space-y-4">
					<div>
						<div className="block text-sm font-medium text-gray-700 mb-2">
							Select Character
						</div>
						<ProfileSelect userId={discordUser.id} />
					</div>
				</div>
			</div>
		</div>
	);
}
