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

