"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CharacterInterest } from "../../types";

interface DiscordUser {
	id: string;
	username: string;
	avatar: string | null;
	created_at: string;
	updated_at: string;
}

interface GroupedInterest {
	discord_id: string;
	created_at: string; // timestamp of earliest (or latest) interest in group (we'll use latest)
	interests: CharacterInterest[];
	user?: DiscordUser;
}

function discordAvatarUrl(user: DiscordUser): string {
	if (user.avatar) {
		return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
	}
	// default avatar (based on discriminator algorithm removed 2024, but fallback simple)
	return `https://cdn.discordapp.com/embed/avatars/0.png`;
}

export default function ClassInterestFeed() {
	const [interests, setInterests] = useState<CharacterInterest[]>([]);
	const [users, setUsers] = useState<DiscordUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);
			try {
				const [interestsRes, usersRes] = await Promise.all([
					fetch("/api/character_interests"),
					fetch("/api/discord_users"),
				]);

				if (!interestsRes.ok)
					throw new Error("Failed to load character interests");
				if (!usersRes.ok) throw new Error("Failed to load discord users");

				const interestsData: CharacterInterest[] = await interestsRes.json();
				const usersData: DiscordUser[] = await usersRes.json();

				if (!cancelled) {
					setInterests(interestsData);
					setUsers(usersData);
				}
			} catch (e) {
				const message = e instanceof Error ? e.message : "Failed to load feed";
				if (!cancelled) setError(message);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

	const grouped = useMemo<GroupedInterest[]>(() => {
		if (!interests.length) return [];

		// Sort interests globally by created_at desc
		const sorted = [...interests].sort((a, b) =>
			b.created_at.localeCompare(a.created_at),
		);

		const groups = new Map<string, GroupedInterest>();

		for (const interest of sorted) {
			const existing = groups.get(interest.discord_id);
			if (!existing) {
				groups.set(interest.discord_id, {
					discord_id: interest.discord_id,
					created_at: interest.created_at, // since sorted desc first interest encountered is latest
					interests: [interest],
				});
			} else {
				existing.interests.push(interest);
			}
		}

		// After grouping, sort each group's interests by lexorank asc
		const result: GroupedInterest[] = Array.from(groups.values()).map((g) => ({
			...g,
			interests: g.interests.sort((a, b) =>
				a.lexorank.localeCompare(b.lexorank),
			),
			user: userMap.get(g.discord_id),
		}));

		// Sort groups by created_at desc (already implied but enforce)
		result.sort((a, b) => b.created_at.localeCompare(a.created_at));
		return result;
	}, [interests, userMap]);

	if (loading) {
		return <div className="p-4 text-sm text-gray-600">Loading feed...</div>;
	}
	if (error) {
		return <div className="p-4 text-sm text-red-600">{error}</div>;
	}
	if (!grouped.length) {
		return <div className="p-4 text-sm text-gray-600">No activity yet.</div>;
	}

	return (
		<div className="space-y-8">
			{grouped.map((group) => (
				<div
					key={group.discord_id}
					className="relative overflow-hidden rounded-xl border border-slate-600/50 bg-slate-800/40 backdrop-blur-md shadow-lg ring-1 ring-slate-700/40 transition hover:shadow-xl"
				>
					{/* gradient backdrop */}
					<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-700/30 via-slate-800/40 to-slate-900/50" />
					<div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />
					<div className="relative p-5">
						<div className="flex items-start gap-4">
							<div className="shrink-0">
								{group.user && (
									<Image
										src={discordAvatarUrl(group.user)}
										alt={group.user.username}
										width={48}
										height={48}
										className="rounded-full ring-2 ring-slate-600 shadow-md"
									/>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-semibold text-slate-100 tracking-tight">
									{group.user ? group.user.username : group.discord_id}{" "}
									<span className="font-normal text-slate-400">
										has selected classes for
									</span>{" "}
									<span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent font-bold">
										Ambershire
									</span>
									!
								</p>
								<ol className="mt-3 list-decimal list-inside space-y-1 text-sm text-slate-300">
									{group.interests.map((i) => (
										<li key={`${i.id}-${i.lexorank}`} className="pl-1">
											<span className="font-semibold text-slate-100">
												{i.class}
											</span>{" "}
											{i.spec ? renderSpecLabel(i.spec) : <span>(Flex)</span>}
										</li>
									))}
								</ol>
								<p className="mt-4 text-xs text-slate-500 uppercase tracking-wide font-medium">
									{timeAgo(group.created_at)}
								</p>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

// Helper to translate spec id to label
import { VANILLA_CLASS_SPECS, type VanillaWowClass } from "../../types";

function timeAgo(iso: string): string {
	const date = new Date(iso);
	const now = new Date();
	let diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
	if (Number.isNaN(diffSec) || diffSec < 0) diffSec = 0;
	if (diffSec < 120) return "Just now"; // less than 2 minutes
	const minute = 60;
	const hour = 60 * minute;
	const day = 24 * hour;
	const week = 7 * day;
	const month = 30 * day; // approx
	const year = 365 * day; // approx
	if (diffSec < hour) {
		const m = Math.floor(diffSec / minute);
		return `${m} minute${m === 1 ? "" : "s"} ago`;
	}
	if (diffSec < day) {
		const h = Math.floor(diffSec / hour);
		return `${h} hour${h === 1 ? "" : "s"} ago`;
	}
	if (diffSec < week) {
		const d = Math.floor(diffSec / day);
		return `${d} day${d === 1 ? "" : "s"} ago`;
	}
	if (diffSec < month) {
		const w = Math.floor(diffSec / week);
		return `${w} week${w === 1 ? "" : "s"} ago`;
	}
	if (diffSec < year) {
		const mo = Math.floor(diffSec / month);
		return `${mo} month${mo === 1 ? "" : "s"} ago`;
	}
	const y = Math.floor(diffSec / year);
	return `${y} year${y === 1 ? "" : "s"} ago`;
}

function renderSpecLabel(specId: string): string {
	for (const wowClass of Object.keys(
		VANILLA_CLASS_SPECS,
	) as VanillaWowClass[]) {
		const found = VANILLA_CLASS_SPECS[wowClass].find((s) => s.id === specId);
		if (found) return `(${found.label})`;
	}
	return "";
}
