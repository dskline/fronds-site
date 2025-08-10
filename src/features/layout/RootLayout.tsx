import "./globals.css";
import clsx from "clsx";
import Image from "next/image";
import type { ReactNode } from "react";
import { Navbar } from "src/features/layout/Navbar";
import BackgroundImage from "./background.webp";

export const metadata = {
	title: "Fronds",
	description: "Fronds site",
};

export function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={clsx("min-h-screen bg-neutral-900 text-neutral-100")}>
				<div className="fixed inset-0 z-[-1]">
					<Image
						src={BackgroundImage}
						alt="Background"
						className="w-full h-auto opacity-20"
						quality={100}
						priority
					/>
				</div>
				<div className="relative">
					<Navbar />
					{children}
				</div>
			</body>
		</html>
	);
}
