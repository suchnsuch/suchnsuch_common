export function clamp(value: number, min: number, max: number, step?: number) {
	const clamped = Math.min(Math.max(value, min), max)
	if (step !== undefined) {
		let offset = value - min
		let remainder = offset % step

		if (remainder > step / 2) {
			return clamped + step - remainder
		}
		else {
			return clamped - remainder
		}
	}
	return clamped
}

export function wrapIndex(value: number, count: number) {
	while (value < 0) {
		value += count
	}
	while (value >= count) {
		value -= count
	}
	return value
}
