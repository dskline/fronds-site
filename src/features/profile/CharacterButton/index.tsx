import clsx from "clsx";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { Character, SpecId, VanillaWowClass } from "../types";
import druidIcon from "./classIcons/druid.webp";
import hunterIcon from "./classIcons/hunter.webp";
import mageIcon from "./classIcons/mage.webp";
import paladinIcon from "./classIcons/paladin.webp";
import priestIcon from "./classIcons/priest.webp";
import rogueIcon from "./classIcons/rogue.webp";
import shamanIcon from "./classIcons/shaman.webp";
import warlockIcon from "./classIcons/warlock.webp";
import warriorIcon from "./classIcons/warrior.webp";
import dpsIcon from "./roleIcons/dps.webp";
import healerIcon from "./roleIcons/healer.webp";
import tankIcon from "./roleIcons/tank.webp";
import druid_balance from "./specIcons/druid_balance.webp";
import druid_feral from "./specIcons/druid_feral.webp";
import druid_guardian from "./specIcons/druid_guardian.webp";
import druid_resto from "./specIcons/druid_resto.webp";
import hunter_bm from "./specIcons/hunter_bm.webp";
import hunter_mm from "./specIcons/hunter_mm.webp";
import hunter_survival from "./specIcons/hunter_survival.webp";
import mage_arcane from "./specIcons/mage_arcane.webp";
import mage_fire from "./specIcons/mage_fire.webp";
import mage_frost from "./specIcons/mage_frost.webp";
import paladin_holy from "./specIcons/paladin_holy.webp";
import paladin_prot from "./specIcons/paladin_prot.webp";
import paladin_ret from "./specIcons/paladin_ret.webp";
import priest_disc from "./specIcons/priest_disc.webp";
import priest_holy from "./specIcons/priest_holy.webp";
import priest_shadow from "./specIcons/priest_shadow.webp";
import rogue_assassin from "./specIcons/rogue_assassin.webp";
import rogue_combat from "./specIcons/rogue_combat.webp";
import rogue_subtlety from "./specIcons/rogue_subtlety.webp";
import shaman_elemental from "./specIcons/shaman_elemental.webp";
import shaman_enhancement from "./specIcons/shaman_enhancement.webp";
import shaman_resto from "./specIcons/shaman_resto.webp";
import warlock_affliction from "./specIcons/warlock_affliction.webp";
import warlock_demo from "./specIcons/warlock_demo.webp";
import warlock_destruction from "./specIcons/warlock_destruction.webp";
import warrior_arms from "./specIcons/warrior_arms.webp";
import warrior_fury from "./specIcons/warrior_fury.webp";
import warrior_prot from "./specIcons/warrior_prot.webp";

export type RoleIcon = "tank" | "healer" | "dps";
export type SpecIconMode = "main_spec" | "off_spec";

interface CharacterButtonBaseProps {
	character: Character;
	className?: string;
	showRoleIcon?: RoleIcon; // overrides class icon
	showSpecIcon?: SpecIconMode; // overrides role + class icon
	onClick?: (character: Character) => void;
}

type ButtonOrSpanProps = CharacterButtonBaseProps &
	React.HTMLAttributes<HTMLButtonElement | HTMLSpanElement>;

const CLASS_ICON_MAP: Record<VanillaWowClass, StaticImageData> = {
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

const ROLE_ICON_MAP: Record<RoleIcon, StaticImageData> = {
	tank: tankIcon,
	healer: healerIcon,
	dps: dpsIcon,
};

const SPEC_ICON_MAP: Record<SpecId, StaticImageData> = {
	DRUID_BALANCE: druid_balance,
	DRUID_FERAL: druid_feral,
	DRUID_GUARDIAN: druid_guardian,
	DRUID_RESTO: druid_resto,
	HUNTER_BM: hunter_bm,
	HUNTER_MM: hunter_mm,
	HUNTER_SURVIVAL: hunter_survival,
	MAGE_ARCANE: mage_arcane,
	MAGE_FIRE: mage_fire,
	MAGE_FROST: mage_frost,
	PALADIN_HOLY: paladin_holy,
	PALADIN_PROT: paladin_prot,
	PALADIN_RET: paladin_ret,
	PRIEST_DISC: priest_disc,
	PRIEST_HOLY: priest_holy,
	PRIEST_SHADOW: priest_shadow,
	ROGUE_ASSASSIN: rogue_assassin,
	ROGUE_COMBAT: rogue_combat,
	ROGUE_SUBTLETY: rogue_subtlety,
	SHAMAN_ELEMENTAL: shaman_elemental,
	SHAMAN_ENHANCE: shaman_enhancement,
	SHAMAN_RESTO: shaman_resto,
	WARLOCK_AFFLICTION: warlock_affliction,
	WARLOCK_DEMO: warlock_demo,
	WARLOCK_DESTRO: warlock_destruction,
	WARRIOR_ARMS: warrior_arms,
	WARRIOR_FURY: warrior_fury,
	WARRIOR_PROT: warrior_prot,
};

const baseStyles =
	"group inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white transition-colors select-none disabled:opacity-50";
const hoverBg = "hover:bg-white/5";

export function CharacterButton({
	character,
	className,
	showRoleIcon,
	showSpecIcon,
	onClick,
	...rest
}: ButtonOrSpanProps) {
	const { name, class: classNameWow, main_spec, off_spec } = character;

	let icon: StaticImageData = CLASS_ICON_MAP[classNameWow as VanillaWowClass];
	if (showSpecIcon) {
		const spec = showSpecIcon === "main_spec" ? main_spec : off_spec;
		if (spec && SPEC_ICON_MAP[spec]) icon = SPEC_ICON_MAP[spec];
	} else if (showRoleIcon) {
		icon = ROLE_ICON_MAP[showRoleIcon];
	}

	if (onClick) {
		return (
			<button
				className={clsx(baseStyles, hoverBg, className)}
				onClick={() => onClick(character)}
				{...rest}
			>
				<Image
					src={icon}
					alt={name}
					width={28}
					height={28}
					className="h-7 w-7 object-contain"
				/>
				<span className="truncate max-w-[10rem]">{name}</span>
			</button>
		);
	}
	return (
		<span className={clsx(baseStyles, hoverBg, className)} {...rest}>
			<Image
				src={icon}
				alt={name}
				width={28}
				height={28}
				className="h-7 w-7 object-contain"
			/>
			<span className="truncate max-w-[10rem]">{name}</span>
		</span>
	);
}
