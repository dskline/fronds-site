"use client";
import { usePathname } from "next/navigation";

export function Navigation() {
	const pathname = usePathname();
	return (
		<nav>
			<ul>
				{pathname !== "/" && (
					<li>
						<div>
							<a href="/" className="text-white text-lg font-bold">
								Fronds
							</a>
						</div>
					</li>
				)}
			</ul>
		</nav>
	);
}
