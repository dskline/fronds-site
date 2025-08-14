import { supabase } from "src/features/database";

// GET /api/discord_users
// Returns all discord users
export async function GET() {
	try {
		const { data, error } = await supabase
			.from("discord_users")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching discord_users:", error);
			return new Response("Failed to load discord users", { status: 500 });
		}

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error fetching discord_users:", error);
		return new Response("Failed to load discord users", { status: 500 });
	}
}
