import type { ReactNode } from "react";
import { RootLayout } from "src/features/layout/RootLayout";

export default function Layout({ children }: { children: ReactNode }) {
	return <RootLayout>{children}</RootLayout>;
}
