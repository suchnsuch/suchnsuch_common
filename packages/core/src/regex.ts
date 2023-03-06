/**
 * Returns the array of ranges representing the group range indices from a match.
 * In order for this to work, the source regex must be compiled with the 'd' flag.
 * @param match The result of a regex compiled with the 'd' flag
 * @returns 
 */
export function getRegexMatchIndices(match: RegExpMatchArray): (number[])[] | undefined {
	if ('indices' in match) {
		return (match as any).indices as (number[])[]
	}
	return undefined
}
