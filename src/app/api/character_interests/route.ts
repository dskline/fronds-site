import { supabase } from "src/features/database";

// GET /api/character_interests
// Returns all character interests ordered by created_at (newest first)
export async function GET() {
	try {
		const { data, error } = await supabase
			.from("character_interests")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching character_interests:", error);
			return new Response("Failed to load character interests", {
				status: 500,
			});
		}

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error fetching character_interests:", error);
		return new Response("Failed to load character interests", { status: 500 });
	}
}
