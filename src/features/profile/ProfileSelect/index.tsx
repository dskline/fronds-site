"use client";

import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	PlusIcon,
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import type { Database } from "../../database";

type Character = Database["public"]["Tables"]["characters"]["Row"];

type ProfileSelectProps = {
	userId: string;
};

export const ProfileSelect = ({ userId }: ProfileSelectProps) => {
	const [characters, setCharacters] = useState<Character[]>([]);
	const [selectedCharacter, setSelectedCharacter] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	const handleValueChange = (value: string) => {
		if (value === "add-character") {
			// Handle adding a new character - you can implement navigation or modal logic here
			console.log("Add new character clicked");
			return;
		}
		setSelectedCharacter(value);
	};

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

	return (
		<Select.Root value={selectedCharacter} onValueChange={handleValueChange}>
			<Select.Trigger className="inline-flex items-center justify-between px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 min-w-[200px]">
				<Select.Value
					placeholder={
						characters.length === 0
							? "No characters yet"
							: "Select character..."
					}
				/>
				<Select.Icon className="ml-2">
					<ChevronDownIcon className="h-4 w-4" />
				</Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200 z-50">
					<Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-400 cursor-default">
						<ChevronUpIcon className="h-4 w-4" />
					</Select.ScrollUpButton>

					<Select.Viewport className="p-1">
						{characters.length === 0 ? (
							<div className="px-8 py-2 text-sm text-gray-500 text-center">
								No characters found
							</div>
						) : (
							characters.map((character) => (
								<Select.Item
									key={character.id}
									value={character.id.toString()}
									className="relative flex items-center px-8 py-2 text-sm text-gray-900 cursor-default select-none hover:bg-indigo-600 hover:text-white rounded-sm outline-none data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white"
								>
									<Select.ItemText>{character.name}</Select.ItemText>
									<Select.ItemIndicator className="absolute left-2 flex items-center justify-center">
										<CheckIcon className="h-4 w-4" />
									</Select.ItemIndicator>
								</Select.Item>
							))
						)}

						{characters.length > 0 && (
							<Select.Separator className="h-px bg-gray-200 my-1" />
						)}

						<Select.Item
							value="add-character"
							className="relative flex items-center px-8 py-2 text-sm text-gray-900 cursor-default select-none hover:bg-green-600 hover:text-white rounded-sm outline-none data-[highlighted]:bg-green-600 data-[highlighted]:text-white"
						>
							<Select.ItemText className="flex items-center">
								<PlusIcon className="h-4 w-4 mr-2" />
								Add Character
							</Select.ItemText>
						</Select.Item>
					</Select.Viewport>

					<Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-400 cursor-default">
						<ChevronDownIcon className="h-4 w-4" />
					</Select.ScrollDownButton>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
};
