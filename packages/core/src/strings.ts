export function escapeRegExp(string: string) {
	// From https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function repeatString(text: string, count: number) {
	let result = ''
	for (let i = 0; i < count; i++) {
		result += text
	}
	return result
}

// \u200D is a zero-width-joiner
// \ud800-\udbff is the range for a first surrogate pair
// \udc00-\udfff is the range for a second surrogate pair
// See: https://javascript.info/unicode#surrogate-pairs
const FULL_STEP_MATCH = /[\u200D\ud800-\udbff\udc00-\udfff]/

/**
 * Finds the "full character step" (e.g. emoji, compound emoji) from a given index in the given string.
 * With normal ASCII-like unicode characters, a single character will be returned.
 * Will return two-characters for surrogate pairs (e.g. ❄️).
 * Will return many characters for characters combined with \u200D, the zero-lenght joiner.
 * @param text The input text
 * @param index The position from which to find the full character step.
 */
export function findFullCharacterForward(text: string, index = 0): string | undefined {
	if (index < 0 || index >= text.length) return undefined

	const char = text[index]
	if (!char.match(FULL_STEP_MATCH)) {
		// At a normal character, just stop
		return char
	}

	let lastIndex = index + 1
	while (lastIndex < text.length) {
		// Check the next character
		const next = text[lastIndex]
		if (!next.match(FULL_STEP_MATCH)) {
			// The next character was totally normal. We're done.
			break
		}
		// The next character is one of a surrogate pair (See: https://javascript.info/unicode#surrogate-pairs)
		// or is a zero-length-joiner (\u200D) which combines emoji
		// Either way, we want to consume it
		lastIndex++
	}

	return text.substring(index, lastIndex)
}

/**
 * Finds the "full character step" (e.g. emoji, compound emoji) just before a given index in the given string.
 * With normal ASCII-like unicode characters, a single character will be returned.
 * Will return two-characters for surrogate pairs (e.g. ❄️).
 * Will return many characters for characters combined with \u200D, the zero-lenght joiner.
 * @param text The input text
 * @param index The position from which to find the full character step.
 */
export function findFullCharacterReverse(text: string, index: number): string | undefined {
	if (index < 0 || index >= text.length) return undefined

	let lastIndex = index - 1
	while (lastIndex >= 0) {
		// Check the next character
		const next = text[lastIndex]
		if (!next.match(FULL_STEP_MATCH)) {
			// The next character was totally normal. We're done.
			break
		}
		// The next character is one of a surrogate pair (See: https://javascript.info/unicode#surrogate-pairs)
		// or is a zero-length-joiner (\u200D) which combines emoji
		// Either way, we want to consume it
		lastIndex--
	}

	if (index - lastIndex > 1) {
		// Need to shift this back forward
		return text.substring(lastIndex + 1, index)
	}
	return text.substring(lastIndex, index)
}
