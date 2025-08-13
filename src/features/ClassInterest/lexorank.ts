// Simple lexorank utility for reordering items
// Uses a much simpler approach with fractional strings

export function getInitialRank(): string {
	return "n"; // Middle of alphabet
}

export function getRankBetween(
	prev: string | null,
	next: string | null,
): string {
	if (!prev && !next) {
		return getInitialRank();
	}

	if (!prev) {
		// Insert before next - use a character before next's first char
		return getRankBefore(next || "a");
	}

	if (!next) {
		// Insert after prev - use a character after prev's last char or extend
		return getRankAfter(prev);
	}

	return getRankBetweenStrings(prev, next);
}

function getRankBefore(rank: string): string {
	const firstChar = rank.charAt(0);
	const charCode = firstChar.charCodeAt(0);

	if (charCode > 97) {
		// 'a'
		// Use previous character
		return String.fromCharCode(charCode - 1);
	}

	// If it's 'a', prepend with 'a'
	return `a${rank}`;
}

function getRankAfter(rank: string): string {
	const lastChar = rank.charAt(rank.length - 1);
	const charCode = lastChar.charCodeAt(0);

	if (charCode < 122) {
		// 'z'
		// Use next character
		return rank.slice(0, -1) + String.fromCharCode(charCode + 1);
	}

	// If it's 'z', append 'a'
	return `${rank}a`;
}

function getRankBetweenStrings(prev: string, next: string): string {
	// Find the first differing character position
	let i = 0;
	while (i < prev.length && i < next.length && prev[i] === next[i]) {
		i++;
	}

	// Get the characters at the differing position
	const prevChar = i < prev.length ? prev.charCodeAt(i) : 96; // char before 'a'
	const nextChar = i < next.length ? next.charCodeAt(i) : 123; // char after 'z'

	// If there's a character in between, use it
	if (nextChar - prevChar > 1) {
		const midChar = String.fromCharCode(Math.floor((prevChar + nextChar) / 2));
		return prev.slice(0, i) + midChar;
	}

	// No character in between, extend with 'a'
	return `${prev}a`;
}
