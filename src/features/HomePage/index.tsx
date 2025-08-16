import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import DiscordAuth from "src/features/DiscordAuth";
import type { DiscordUser } from "src/features/DiscordAuth/schema";
import ClassInterestFeed from "../profile/ClassInterest/components/ClassInterestFeed";
import FrondsLogo from "./fronds-logo.webp";

export default async function HomePage() {
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

	return (
		<div className="min-h-screen flex flex-col">
			<div className="h-screen min-h-[300px] max-h-[500px] flex flex-col items-center justify-center">
				<div className="h-1/3 w-3/4 lg:w-1/3 mx-auto">
					<Image
						src={FrondsLogo}
						alt="Fronds Logo"
						width={800}
						height={200}
						priority
						className="relative object-contain mx-auto"
					/>
				</div>
				<div>
					{discordUser ? (
						<Link
							href="/interest"
							className="flex items-center justify-center w-full h-12 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold py-2 px-8 rounded shadow-md shadow-emerald-900/30 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
						>
							Pick your class interests for Ambershire
						</Link>
					) : (
						<DiscordAuth />
					)}
				</div>
			</div>
			<div className="flex-1 w-full pb-16 px-4">
				<div className="max-w-3xl mx-auto">
					<h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
						<span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 animate-pulse" />
						Recent Guild Activity
					</h2>
					<ClassInterestFeed />
				</div>
			</div>
		</div>
	);
}
