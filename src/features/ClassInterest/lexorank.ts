// Lexorank utility for reordering items
// Based on simplified lexorank algorithm

const BASE_36_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MIN_CHAR = "0";
const MAX_CHAR = "Z";

export function getInitialRank(): string {
	return "m";
}

export function getRankBetween(
	prev: string | null,
	next: string | null,
): string {
	if (!prev && !next) {
		return getInitialRank();
	}

	if (!prev) {
		return getRankBefore(next || "");
	}

	if (!next) {
		return getRankAfter(prev);
	}

	return getRankBetweenStrings(prev, next);
}

function getRankBefore(rank: string): string {
	const firstChar = rank.charAt(0);
	if (firstChar === MIN_CHAR) {
		return MIN_CHAR + rank;
	}

	const prevChar = BASE_36_CHARS[BASE_36_CHARS.indexOf(firstChar) - 1];
	return prevChar + "Z";
}

function getRankAfter(rank: string): string {
	const lastChar = rank.charAt(rank.length - 1);
	if (lastChar === MAX_CHAR) {
		return rank + MIN_CHAR;
	}

	const nextChar = BASE_36_CHARS[BASE_36_CHARS.indexOf(lastChar) + 1];
	return rank.slice(0, -1) + nextChar;
}

function getRankBetweenStrings(prev: string, next: string): string {
	// Simple midpoint calculation
	const maxLength = Math.max(prev.length, next.length);
	const paddedPrev = prev.padEnd(maxLength, MIN_CHAR);
	const paddedNext = next.padEnd(maxLength, MIN_CHAR);

	let result = "";
	for (let i = 0; i < maxLength; i++) {
		const prevCharIndex = BASE_36_CHARS.indexOf(paddedPrev[i]);
		const nextCharIndex = BASE_36_CHARS.indexOf(paddedNext[i]);

		if (prevCharIndex === nextCharIndex) {
			result += BASE_36_CHARS[prevCharIndex];
			continue;
		}

		const midIndex = Math.floor((prevCharIndex + nextCharIndex) / 2);
		result += BASE_36_CHARS[midIndex];
		break;
	}

	// If we couldn't find a midpoint, add a character
	if (result === prev || result === next) {
		result = prev + "1";
	}

	return result;
}
