import { NextResponse } from "next/server";

function getEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Environment variable ${name} is not set`);
	}
	return value;
}

export async function GET() {
	try {
		const clientId = getEnv("DISCORD_CLIENT_ID");
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const redirectUri = `${baseUrl}/api/discord/callback`;

		// Generate a random state parameter for CSRF protection
		const state = crypto.randomUUID();

		// Build Discord OAuth2 authorization URL
		const params = new URLSearchParams({
			client_id: clientId,
			response_type: "code",
			redirect_uri: redirectUri,
			scope: "identify",
			state: state,
		});

		const discordUrl = `https://discord.com/oauth2/authorize?${params.toString()}`;

		// Set state in cookie and redirect to Discord
		const response = NextResponse.redirect(discordUrl);
		response.cookies.set("discord_oauth_state", state, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 300, // 5 minutes
			sameSite: "lax",
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Discord OAuth login error:", error);
		return NextResponse.json(
			{ error: "Failed to initiate Discord OAuth" },
			{ status: 500 },
		);
	}
}
