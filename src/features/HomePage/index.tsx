import Image from "next/image";
import DiscordAuth from "src/features/DiscordAuth";
import FrondsLogo from "./fronds-logo.webp";

export default function HomePage() {
	return (
		<div className="min-h-screen">
			<div className="h-screen min-h-[500px] max-h-[700px] flex flex-col items-center justify-center">
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
					<DiscordAuth />
				</div>
			</div>
		</div>
	);
}
