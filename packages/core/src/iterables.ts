/**
 * Pulls the first item from an array, or null.
 * Handles both empty and null arrays.
 */
export function firstOrNull<T>(array: T[]): T | null {
	return array?.length ? array[0] : null
}

export function last(text: string): string
export function last<T>(array: T[]): T
export function last(array: any) {
	return array[array.length - 1]
}

/**
 * Checks if the target array includes any item in the source array
 */
export function includesAny<T>(target: T[], source: T[]) {
	for (const i of source) {
		if (target.includes(i)) {
			return true
		}
	}
	return false
}

/**
 * Finds the index of a value that matches the given equivalency predicate
 * @param target The value to look for
 * @param source The array to look in
 * @param equivalency The equivalency function to use
 * @returns The index of the equivalent item or -1
 */
export function indexOfEquivalent<T>(target: T, source: T[], equivalency: (a: T, b: T) => boolean) {
	for (let i = 0; i < source.length; i++) {
		if (equivalency(target, source[i])) {
			return i
		}
	}
	return -1
}

/**
 * Moves through an iterator and finds the first item that satisfies `instanceof` the given type.
 */
export function firstOfType<T, S>(iterator: Iterable<S>, type: new (...args: any[]) => T): T | null {
	for (const i of iterator) {
		if (i instanceof type) return i as T
	}
	return null
}

/**
 * If a value is not nullish, returns an array with that value in it.
 * Otherwise, returns an empty array.
 */
export function singleOrEmpty<T>(value: T): T[] {
	return (value !== null && value !== undefined) ? [value] : []
}

/**
 * Removes an item from an array by putting the last item in the array in its place.
 * Does not require shifting all subsequent items in the array, but does not maintain order.
 * Returns the index of the array
 */
export function swapRemove<T>(array: T[], item: T) {
	if (array.length === 0) return -1

	const index = array.indexOf(item)
	if (index < 0) return -1

	if (index === array.length - 1) {
		array.pop()
		return array.length
	}
	else {
		const last = array.pop()
		if (last !== undefined) array[index] = last
	}
	return index
}

/**
 * Simple check for if an iterator contains any items.
 * Consumes the iterator.
 */
export function hasItems(iterator: Iterable<any>) {
	for (const i of iterator) {
		return true
	}
	return false
}

/**
 * Returns an iterator with the results of a function called on every item in a given iterator.
 */
export function* mapIterator<I, M>(iterator: Iterable<I>, mapper: (item: I) => M): Generator<M> {
	for (const i of iterator) {
		yield mapper(i)
	}
}

/**
 * Returns an iterator with the items of a given iterator that satisfy the given predicate.
 */
export function* filterIterator<I>(iterator: Iterable<I>, predicate: (item: I) => boolean): Generator<I> {
	for (const i of iterator) {
		if (predicate(i)) {
			yield i
		}
	}
}

/**
 * Returns an iterator with the results of the mapping function, discarding any nullish values.
 */
export function* filterMapIterator<I, M>(iterator: Iterable<I>, predicate: (item: I) => M): Generator<M> {
	for (const i of iterator) {
		const result = predicate(i)
		if (result != null) yield result
	}
}

/**
 * Returns whether or not the two arrays have the same (or equivalwnt) items within them.
 * @param equivalency (Optional) A function that determines whether or not two items in the array count as equal
 * @returns true if all items in both arrays are equal
 */
export function arraysEqual<T>(a: T[], b: T[], equivalency?: (a: T, b: T) => boolean) {
	if (a === b) return true
	if (a.length !== b.length) return false
	if (equivalency) {
		for (let i = 0; i < a.length; i++) {
			if (!equivalency(a[i], b[i])) return false
		}
	}
	else {
		for (let i = 0; i < a.length; i++) {
			if (a[i] !== b[i]) return false
		}
	}
	
	return true
}

/**
 * Iterates through two lists at the same time, feeding the items as arguments to the handler.
 */
export function zip<A, B>(lists: [A[], B[]], handler: (a: A, b: B) => void): void
/**
 * Iterates through three lists at the same time, feeding the items as arguments to the handler.
 */
export function zip<A, B, C>(lists: [A[], B[], C[]], handler: (a: A, b: B, c: C) => void): void
export function zip(lists: any[][], handler: any) {
	const max = lists.reduce((last, list) => {
		if (list.length > last) return list.length
		return last
	}, 0)
	for (let index = 0; index < max; index++) {
		handler(...lists.map(l => l[index]))
	}
}

/**
 * Iterates through two lists at the same time, feeding the items to handler as arguments.
 * @returns The results of handler as an array
 */
export function zipMap<A, B, T>(lists: [A[], B[]], handler: (a: A, b: B) => T): T[]
/**
 * Iterates through three lists at the same time, feeding the items to handler as arguments.
 * @returns The results of handler as an array
 */
export function zipMap<A, B, C, T>(lists: [A[], B[], C[]], handler: (a: A, b: B, c: C) => T): T[]
export function zipMap(lists: any[][], handler: any): any[] {
	const max = lists.reduce((last, list) => {
		if (list.length > last) return list.length
		return last
	}, 0)
	const result: any[] = []
	for (let index = 0; index < max; index++) {
		result.push(handler(...lists.map(l => l[index])))
	}
	return result
}
