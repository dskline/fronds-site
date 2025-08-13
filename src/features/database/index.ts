import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	throw new Error(
		"Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_SERVICE_KEY.",
	);
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface Database {
	public: {
		Tables: {
			characters: {
				Row: {
					id: number;
					discord_id: string;
					name: string;
					class: string;
					main_spec: string | null;
					off_spec: string | null;
					profession_1: string | null;
					profession_2: string | null;
					public_note: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					discord_id: string;
					name: string;
					class: string;
					main_spec?: string | null;
					off_spec?: string | null;
					profession_1?: string | null;
					profession_2?: string | null;
					public_note?: string | null;
				};
				Update: {
					discord_id?: string;
					name?: string;
					class?: string;
					main_spec?: string | null;
					off_spec?: string | null;
					profession_1?: string | null;
					profession_2?: string | null;
					public_note?: string | null;
				};
			};
			character_interests: {
				Row: {
					id: number;
					created_at: string;
					updated_at: string;
					discord_id: string;
					spec: string | null;
					lexorank: string;
					class: string;
				};
				Insert: {
					discord_id: string;
					spec?: string | null;
					lexorank: string;
					class: string;
				};
				Update: {
					discord_id?: string;
					spec?: string | null;
					lexorank?: string;
					class?: string;
				};
			};
			discord_users: {
				Row: {
					id: string; // Discord user ID
					username: string; // global_name or username
					avatar: string | null; // avatar hash
					created_at: string; // timestamp
					updated_at: string; // timestamp
				};
				Insert: {
					id: string;
					username: string;
					avatar?: string | null;
				};
				Update: {
					id?: string;
					username?: string;
					avatar?: string | null;
				};
			};
		};
	};
}

// Type the Supabase client with our database schema
export type SupabaseClient = typeof supabase;
