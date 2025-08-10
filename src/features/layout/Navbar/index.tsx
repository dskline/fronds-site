import { Navigation } from "src/features/layout/Navbar/Navigation";
import { ProfileActionsContainer } from "src/features/layout/Navbar/ProfileActionsContainer";

export async function Navbar() {
	return (
		<div className="absolute top-0 left-0 right-0 bg-opacity-0 p-4">
			<div className="flex justify-between items-center">
				<Navigation />
				<ProfileActionsContainer />
			</div>
		</div>
	);
}
