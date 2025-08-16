"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { DiscordUser } from "src/features/DiscordAuth/schema";
import { ProfileSelect } from "src/features/profile/ProfileSelect";

type Props = {
	discordUser?: DiscordUser;
};
export function ProfileActions({ discordUser }: Props) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [user, setUser] = useState<DiscordUser | undefined>(discordUser);

	useEffect(() => {
		const loginSuccess = searchParams.get("login") === "success";
		if (loginSuccess) {
			router.replace("/"); // Remove the query parameter from the URL
			fetch("/api/profile")
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw new Error("Failed to fetch user");
					}
				})
				.then((data) => {
					setUser(data);
				})
				.catch((error) => {
					console.error("Error fetching user:", error);
				});
		}
	}, [searchParams, router.replace]);

	if (!user) {
		return <Link href="/api/discord/login">Login</Link>;
	}

	return (
		<div className="flex items-center gap-3">
			<ProfileSelect userId={user.id} />
			<Link href="/profile">
				<Image
					src={
						user.avatar
							? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}`
							: `https://discord.com/assets/9855d7e3b9780976.png`
					}
					alt="Discord Avatar"
					width={40}
					height={40}
					className="rounded-full border-2 border-white hover:border-gray-200 transition-colors cursor-pointer"
					priority
				/>
			</Link>
		</div>
	);
}
