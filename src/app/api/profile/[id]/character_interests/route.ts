import { supabase } from "src/features/database";

export async function GET(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	const userId = params.id;

	try {
		const { data, error } = await supabase
			.from("character_interests")
			.select("*")
			.eq("discord_id", userId)
			.order("lexorank");

		if (error) {
			console.error("Error fetching character interests:", error);
			return new Response("Failed to load character interests", {
				status: 500,
			});
		}

		return new Response(JSON.stringify(data), { status: 200 });
	} catch (error) {
		console.error("Error fetching character interests:", error);
		return new Response("Failed to load character interests", { status: 500 });
	}
}

export async function POST(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const userId = params.id;

	try {
		const body = await request.json();
		const { interests } = body;

		if (!Array.isArray(interests)) {
			return new Response("Invalid request body", { status: 400 });
		}

		// First, delete all existing interests for this user
		const { error: deleteError } = await supabase
			.from("character_interests")
			.delete()
			.eq("discord_id", userId);

		if (deleteError) {
			console.error("Error deleting existing interests:", deleteError);
			return new Response("Failed to update interests", { status: 500 });
		}

		// If there are no interests to add, we're done
		if (interests.length === 0) {
			return new Response(JSON.stringify({ success: true }), { status: 200 });
		}

		// Insert new interests
		const interestsToInsert = interests.map(
			(interest: { class: string; spec: string | null; lexorank: string }) => ({
				discord_id: userId,
				class: interest.class,
				spec: interest.spec,
				lexorank: interest.lexorank,
			}),
		);

		const { error: insertError } = await supabase
			.from("character_interests")
			.insert(interestsToInsert);

		if (insertError) {
			console.error("Error inserting new interests:", insertError);
			return new Response("Failed to save interests", { status: 500 });
		}

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error("Error updating character interests:", error);
		return new Response("Failed to update character interests", {
			status: 500,
		});
	}
}
