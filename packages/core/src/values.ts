export function isValue(value: unknown) {
	return value !== undefined && value !== null
}

export function numberOr(value?: number, or?: number) {
	return (typeof value === 'number') ? value : or
}

export function stringOr(value?: string, or?: string) {
	return (typeof value === 'string') ? value : or
}