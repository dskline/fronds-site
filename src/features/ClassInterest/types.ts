export interface CharacterInterest {
	id: number;
	created_at: string;
	updated_at: string;
	discord_id: string;
	spec: string | null;
	lexorank: string;
	class: string;
}

export const VANILLA_WOW_CLASSES = [
	"Warrior",
	"Paladin",
	"Hunter",
	"Rogue",
	"Priest",
	"Shaman",
	"Mage",
	"Warlock",
	"Druid",
] as const;

export type VanillaWowClass = (typeof VANILLA_WOW_CLASSES)[number];
