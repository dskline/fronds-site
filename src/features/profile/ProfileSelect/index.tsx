"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import * as Toast from "@radix-ui/react-toast";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Database } from "../../database";
import { CharacterButton } from "../CharacterButton";
import druidIcon from "../CharacterButton/classIcons/druid.webp";
import hunterIcon from "../CharacterButton/classIcons/hunter.webp";
import mageIcon from "../CharacterButton/classIcons/mage.webp";
import paladinIcon from "../CharacterButton/classIcons/paladin.webp";
import priestIcon from "../CharacterButton/classIcons/priest.webp";
import rogueIcon from "../CharacterButton/classIcons/rogue.webp";
import shamanIcon from "../CharacterButton/classIcons/shaman.webp";
import warlockIcon from "../CharacterButton/classIcons/warlock.webp";
import warriorIcon from "../CharacterButton/classIcons/warrior.webp";
import type { SpecId, VanillaWowClass } from "../types";

const CLASS_ICON_MAP: Record<string, StaticImageData> = {
	Warrior: warriorIcon,
	Paladin: paladinIcon,
	Hunter: hunterIcon,
	Rogue: rogueIcon,
	Priest: priestIcon,
	Shaman: shamanIcon,
	Mage: mageIcon,
	Warlock: warlockIcon,
	Druid: druidIcon,
};

type Character = Database["public"]["Tables"]["characters"]["Row"];

type ProfileSelectProps = {
	userId: string;
};

export const ProfileSelect = ({ userId }: ProfileSelectProps) => {
	const [characters, setCharacters] = useState<Character[]>([]);
	const [selectedCharacter, setSelectedCharacter] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [toastOpen, setToastOpen] = useState(false);

	useEffect(() => {
		const fetchCharacters = async () => {
			try {
				const data = await fetch(`/api/profile/${userId}/characters`).then(
					(res) => res.json(),
				);

				if (error) {
					console.error("Error fetching characters:", error);
					setError("Failed to load characters");
					return;
				}

				setCharacters(data || []);
			} catch (error) {
				console.error("Error fetching characters:", error);
				setError("Failed to load characters");
			} finally {
				setLoading(false);
			}
		};

		fetchCharacters();
	}, [userId, error]);

	if (loading) {
		return (
			<div className="flex items-center justify-center p-4">
				<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (error) {
		return <div className="p-4 text-red-600 bg-red-50 rounded-md">{error}</div>;
	}

	const toCharacter = (c: Character) => ({
		name: c.name,
		class: c.class as VanillaWowClass,
		main_spec: c.main_spec ? (c.main_spec.toUpperCase() as SpecId) : undefined,
		off_spec: c.off_spec ? (c.off_spec.toUpperCase() as SpecId) : undefined,
	});

	// Popover variant for >3 characters
	if (characters.length > 3) {
		const uniqueClasses = Array.from(new Set(characters.map((c) => c.class)));
		return (
			<Toast.Provider swipeDirection="right">
				<div className="inline-block">
					<Popover.Root>
						<Popover.Trigger asChild>
							<button
								type="button"
								className="relative flex -space-x-3 rounded-full p-2 hover:bg-white/10 transition focus:outline-none"
								aria-label="Show your characters"
							>
								{uniqueClasses.slice(0, 5).map((cls, idx) => (
									<span
										key={cls}
										className="inline-block ring-2 ring-slate-800 rounded-full overflow-hidden bg-slate-700"
										style={{ zIndex: 10 - idx }}
									>
										<Image
											src={CLASS_ICON_MAP[cls]}
											alt={cls}
											width={32}
											height={32}
											className="h-8 w-8 object-contain"
										/>
									</span>
								))}
								{uniqueClasses.length > 5 && (
									<span className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-700 text-[10px] font-medium ring-2 ring-slate-800">
										+{uniqueClasses.length - 5}
									</span>
								)}
							</button>
						</Popover.Trigger>
						<Popover.Portal>
							<Popover.Content
								align="start"
								sideOffset={8}
								className="w-[340px] max-w-sm rounded-lg border border-slate-600/40 bg-slate-800/80 backdrop-blur-md p-4 shadow-xl focus:outline-none animate-in fade-in zoom-in"
							>
								<div className="space-y-3">
									<div className="flex flex-wrap gap-2">
										{characters.map((c) => (
											<CharacterButton
												key={c.id}
												character={toCharacter(c)}
												className="bg-white/5 hover:bg-white/10"
											/>
										))}
									</div>
									<button
										type="button"
										onClick={() => setToastOpen(true)}
										className="mt-2 inline-flex items-center gap-2 rounded-md bg-green-600/15 px-3 py-2 text-xs font-medium text-green-300 hover:bg-green-600/25 focus:outline-none focus:ring-2 focus:ring-green-500/40"
									>
										<PlusIcon className="h-4 w-4" />
										Add Character
									</button>
								</div>
								<Popover.Arrow className="fill-slate-700/70" />
							</Popover.Content>
						</Popover.Portal>
					</Popover.Root>
				</div>
				<Toast.Root
					open={toastOpen}
					onOpenChange={setToastOpen}
					duration={6000}
					className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] fixed bottom-4 right-4 z-50 w-[300px] rounded-lg border border-slate-600/40 bg-slate-800/90 p-4 shadow-lg backdrop-blur-md"
				>
					<Toast.Title className="text-sm font-semibold text-slate-100">
						Coming Soon
					</Toast.Title>
					<Toast.Description className="mt-1 text-xs text-slate-300 leading-relaxed">
						Character management is being implemented. Use{" "}
						<span className="font-medium text-emerald-300">Frondbot</span> on
						Discord for now.
					</Toast.Description>
					<Toast.Action asChild altText="Close">
						<button
							type="button"
							className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-slate-700/60 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-600/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
						>
							OK
						</button>
					</Toast.Action>
				</Toast.Root>
				<Toast.Viewport className="fixed bottom-0 right-0 flex w-[320px] max-w-full flex-col gap-2 p-4 outline-none" />
			</Toast.Provider>
		);
	}

	// Otherwise show inline buttons (<= 3 characters)
	return (
		<div className="flex flex-wrap gap-2 items-start">
			{characters.length === 0 && (
				<div className="text-sm text-white/60 px-3 py-2">No characters yet</div>
			)}
			{characters.map((c) => {
				const selected = selectedCharacter === c.id.toString();
				return (
					<CharacterButton
						key={c.id}
						character={toCharacter(c)}
						onClick={() => setSelectedCharacter(c.id.toString())}
						className={
							selected
								? "bg-indigo-600/30 ring-2 ring-indigo-500"
								: "bg-white/5 hover:bg-white/10"
						}
					/>
				);
			})}
			<button
				type="button"
				onClick={() => console.log("Add new character clicked")}
				className="group inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-green-600/30 border border-dashed border-white/20"
			>
				<PlusIcon className="h-5 w-5" />
				<span>Add Character</span>
			</button>
		</div>
	);
};
