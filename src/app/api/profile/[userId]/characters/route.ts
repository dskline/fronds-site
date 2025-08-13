import { supabase } from "src/features/database";

export async function GET(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	const userId = params.id;

	try {
		const { data, error } = await supabase
			.from("characters")
			.select("*")
			.eq("discord_id", userId)
			.order("name");

		if (error) {
			console.error("Error fetching characters:", error);
			return new Response("Failed to load characters", { status: 500 });
		}

		return new Response(JSON.stringify(data), { status: 200 });
	} catch (error) {
		console.error("Error fetching characters:", error);
		return new Response("Failed to load characters", { status: 500 });
	}
}
