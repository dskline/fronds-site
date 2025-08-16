"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { DiscordUser } from "src/features/DiscordAuth/schema";
import { ProfileSelect } from "src/features/profile/ProfileSelect";

// Simple popover implementation without external deps
function useOnClickOutside(
	ref: React.RefObject<HTMLElement | null>,
	handler: () => void,
) {
	useEffect(() => {
		function listener(e: MouseEvent) {
			if (!ref.current || ref.current.contains(e.target as Node)) return;
			handler();
		}
		document.addEventListener("mousedown", listener);
		return () => document.removeEventListener("mousedown", listener);
	}, [ref, handler]);
}

type Props = {
	discordUser?: DiscordUser;
};
export function ProfileActions({ discordUser }: Props) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [user, setUser] = useState<DiscordUser | undefined>(discordUser);
	const [open, setOpen] = useState(false);
	const popRef = useRef<HTMLDivElement | null>(null);
	useOnClickOutside(popRef, () => setOpen(false));

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
		<div className="flex items-center gap-3 relative" ref={popRef}>
			<ProfileSelect userId={user.id} />
			<button
				type="button"
				className="flex items-center focus:outline-none"
				onClick={() => setOpen((o) => !o)}
				aria-haspopup="true"
				aria-expanded={open}
				aria-label="User menu"
			>
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
			</button>
			{open && (
				<div
					role="menu"
					className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
				>
					<ul className="py-1 text-sm text-gray-700">
						<li>
							<Link
								href="/interest"
								className="block px-4 py-2 hover:bg-gray-100"
								onClick={() => setOpen(false)}
							>
								Ambershire Profile
							</Link>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}
