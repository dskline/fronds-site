"use client";

import clsx from "clsx";
import Image from "next/image";
import discordLogo from "./Discord-Symbol-White.svg";

export default function DiscordAuth() {
	const handleLogin = () => {
		window.location.href = "/api/discord/login";
	};

	return (
		<button
			type="button"
			className={clsx(
				"flex items-center justify-center w-full h-12",
				"bg-indigo-600 hover:bg-indigo-700 text-white font-bold",
				"py-2 px-4 rounded transition-colors duration-200",
			)}
			onClick={handleLogin}
		>
			<Image
				src={discordLogo}
				alt="Discord Logo"
				width={24}
				height={24}
				className="inline-block mr-2"
			/>
			Login with Discord
		</button>
	);
}
