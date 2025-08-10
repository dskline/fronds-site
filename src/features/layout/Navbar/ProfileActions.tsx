"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { DiscordUser } from "src/features/DiscordAuth/schema";

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
			fetch("/api/discord/me")
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

	return (
		<div>
			{!user ? (
				<span className="text-white">Not logged in</span>
			) : (
				<Image
					src={
						user.avatar
							? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}`
							: `https://discord.com/assets/9855d7e3b9780976.png`
					}
					alt="Discord Avatar"
					width={40}
					height={40}
					className="rounded-full border-2 border-white"
					priority
				/>
			)}
		</div>
	);
}
