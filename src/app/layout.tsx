import "./globals.css";
import clsx from "clsx";
import type { ReactNode } from "react";

export const metadata = {
	title: "Fronds",
	description: "Fronds site",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={clsx(
					"min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100",
				)}
			>
				{children}
			</body>
		</html>
	);
}
