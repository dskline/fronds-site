import { type NextRequest, NextResponse } from "next/server";
import type {
	DiscordTokenResponse,
	DiscordUser,
} from "src/features/DiscordAuth/schema";
import { supabase } from "src/features/database";

function getEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Environment variable ${name} is not set`);
	}
	return value;
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const code = searchParams.get("code");
		const state = searchParams.get("state");
		const storedState = request.cookies.get("discord_oauth_state")?.value;

		// Validate state parameter for CSRF protection
		if (!code || !state || !storedState || state !== storedState) {
			return NextResponse.json(
				{ error: "Invalid state parameter or missing code" },
				{ status: 400 },
			);
		}

		const clientId = getEnv("DISCORD_CLIENT_ID");
		const clientSecret = getEnv("DISCORD_CLIENT_SECRET");
		const baseUrl = getEnv("NEXT_PUBLIC_BASE_URL");
		const redirectUri = `${baseUrl}/api/discord/callback`;

		// Exchange code for access token
		const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				grant_type: "authorization_code",
				code: code,
				redirect_uri: redirectUri,
			}).toString(),
		});

		if (!tokenResponse.ok) {
			const errorText = await tokenResponse.text();
			console.error("Discord token exchange failed:", errorText);
			return NextResponse.json(
				{ error: "Failed to exchange code for token" },
				{ status: 500 },
			);
		}

		const tokens: DiscordTokenResponse = await tokenResponse.json();

		// Fetch user information using the access token
		const userResponse = await fetch("https://discord.com/api/users/@me", {
			headers: {
				Authorization: `${tokens.token_type} ${tokens.access_token}`,
			},
		});

		if (!userResponse.ok) {
			const errorText = await userResponse.text();
			console.error("Discord user fetch failed:", errorText);
			return NextResponse.json(
				{ error: "Failed to fetch user information" },
				{ status: 500 },
			);
		}

		const user: DiscordUser = await userResponse.json();

		// Upsert user into supabase discord_users table
		const username = user.global_name || user.username;
		const { error: upsertError } = await supabase.from("discord_users").upsert(
			[
				{
					id: user.id,
					username,
					avatar: user.avatar, // store raw hash; can construct URL client-side
				},
			],
			{ onConflict: "id" },
		);

		if (upsertError) {
			console.error("Failed to upsert discord user:", upsertError);
		}

		// Clean up state cookie and redirect back to home
		const response = NextResponse.redirect(`${baseUrl}/?login=success`);
		response.cookies.delete("discord_oauth_state");

		response.cookies.set(
			"discord_user",
			JSON.stringify({
				id: user.id,
				name: username,
				avatar: user.avatar,
			}),
			{
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			},
		);

		return response;
	} catch (error) {
		console.error("Discord OAuth callback error:", error);
		return NextResponse.json(
			{ error: "OAuth callback failed" },
			{ status: 500 },
		);
	}
}
