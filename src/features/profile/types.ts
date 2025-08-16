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

// Spec identifiers mapped from design (see images)
export type SpecId =
	| "DRUID_BALANCE"
	| "DRUID_FERAL"
	| "DRUID_GUARDIAN"
	| "DRUID_RESTO"
	| "HUNTER_BM"
	| "HUNTER_MM"
	| "HUNTER_SURVIVAL"
	| "MAGE_ARCANE"
	| "MAGE_FIRE"
	| "MAGE_FROST"
	| "PALADIN_HOLY"
	| "PALADIN_PROT"
	| "PALADIN_RET"
	| "PRIEST_DISC"
	| "PRIEST_HOLY"
	| "PRIEST_SHADOW"
	| "ROGUE_ASSASSIN"
	| "ROGUE_COMBAT"
	| "ROGUE_SUBTLETY"
	| "SHAMAN_ELEMENTAL"
	| "SHAMAN_ENHANCE"
	| "SHAMAN_RESTO"
	| "WARLOCK_AFFLICTION"
	| "WARLOCK_DEMO"
	| "WARLOCK_DESTRO"
	| "WARRIOR_ARMS"
	| "WARRIOR_FURY"
	| "WARRIOR_PROT";

export interface SpecOption {
	label: string;
	id: SpecId;
}

export const VANILLA_CLASS_SPECS: Record<VanillaWowClass, SpecOption[]> = {
	Warrior: [
		{ label: "Arms", id: "WARRIOR_ARMS" },
		{ label: "Fury", id: "WARRIOR_FURY" },
		{ label: "Protection", id: "WARRIOR_PROT" },
	],
	Paladin: [
		{ label: "Holy", id: "PALADIN_HOLY" },
		{ label: "Protection", id: "PALADIN_PROT" },
		{ label: "Retribution", id: "PALADIN_RET" },
	],
	Hunter: [
		{ label: "Beast Mastery", id: "HUNTER_BM" },
		{ label: "Marksmanship", id: "HUNTER_MM" },
		{ label: "Survival", id: "HUNTER_SURVIVAL" },
	],
	Rogue: [
		{ label: "Assassination", id: "ROGUE_ASSASSIN" },
		{ label: "Combat", id: "ROGUE_COMBAT" },
		{ label: "Subtlety", id: "ROGUE_SUBTLETY" },
	],
	Priest: [
		{ label: "Discipline", id: "PRIEST_DISC" },
		{ label: "Holy", id: "PRIEST_HOLY" },
		{ label: "Shadow", id: "PRIEST_SHADOW" },
	],
	Shaman: [
		{ label: "Elemental", id: "SHAMAN_ELEMENTAL" },
		{ label: "Enhancement", id: "SHAMAN_ENHANCE" },
		{ label: "Restoration", id: "SHAMAN_RESTO" },
	],
	Mage: [
		{ label: "Arcane", id: "MAGE_ARCANE" },
		{ label: "Fire", id: "MAGE_FIRE" },
		{ label: "Frost", id: "MAGE_FROST" },
	],
	Warlock: [
		{ label: "Affliction", id: "WARLOCK_AFFLICTION" },
		{ label: "Demonology", id: "WARLOCK_DEMO" },
		{ label: "Destruction", id: "WARLOCK_DESTRO" },
	],
	Druid: [
		{ label: "Balance", id: "DRUID_BALANCE" },
		{ label: "Feral", id: "DRUID_FERAL" },
		{ label: "Guardian", id: "DRUID_GUARDIAN" },
		{ label: "Restoration", id: "DRUID_RESTO" },
	],
};

export interface Character {
	name: string;
	class: VanillaWowClass;
	main_spec?: SpecId; // Optional primary spec
	off_spec?: SpecId; // Optional secondary spec
}
