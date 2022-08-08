export function firstOrNull<T>(array: T[]): T | null {
	return array?.length ? array[0] : null
}

export function last<T>(array: T[]): T {
	return array[array.length - 1]
}

export function includesAny<T>(target: T[], source: T[]) {
	for (const i of source) {
		if (target.includes(i)) {
			return true
		}
	}
	return false
}

export function singleOrEmpty<T>(value: T): T[] {
	return (value !== null && value !== undefined) ? [value] : []
}

export function swapRemove<T>(array: T[], item: T) {
	if (array.length === 0) return

	const index = array.indexOf(item)
	if (index < 0) return

	if (index === array.length - 1) {
		array.pop()
	}
	else {
		const last = array.pop()
		if (last !== undefined) array[index] = last
	}
}

export function* mapIterator<I, M>(iterator: Iterable<I>, mapper: (item: I) => M): Generator<M> {
	for (const i of iterator) {
		yield mapper(i)
	}
}

export function* filterIterator<I>(iterator: Iterable<I>, predicate: (item: I) => boolean): Generator<I> {
	for (const i of iterator) {
		if (predicate(i)) {
			yield i
		}
	}
}