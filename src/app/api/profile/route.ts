import { cookies } from "next/headers";

export async function GET() {
	try {
		const user = (await cookies()).get("discord_user")?.value;
		if (!user) {
			return new Response("Unauthorized", { status: 401 });
		}
		return new Response(user);
	} catch (_error) {
		return new Response("Internal Server Error", { status: 500 });
	}
}
