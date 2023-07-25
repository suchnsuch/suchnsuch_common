import { wrapIndex } from './numbers'

export default class RingBuffer<T> {
	private list: Array<T | undefined>
	private _capacity: number
	private _firstIndex: number
	private _lastIndex: number

	constructor(capacity: number)
	constructor(iterable: Iterable<T>)
	constructor(capacity: number, iterable: Iterable<T>)
	constructor(first: number | Iterable<T>, second?: Iterable<T>) {
		const inCapacity = typeof(first) === 'number' ? first : undefined
		const inIterable = typeof(first) === 'number' ? second : first

		const initialList = inCapacity ? new Array(inCapacity) : []
		let count = 0
		if (inIterable) {
			for (let item of inIterable) {
				initialList.push(item)
				count++
			}
		}
		
		this.list = initialList
		this._firstIndex = inIterable ? 0 : -1
		this._lastIndex = inIterable ? count - 1 : -1
		this._capacity = inCapacity ?? initialList.length
	}

	/**
	 * Adds an item to the list and returns that item's index
	 * @param item 
	 */
	push(item: T): number {
		if (this.list.length < this._capacity) {
			this.list.push(item)
			this._lastIndex = this.list.length - 1
			return this._lastIndex
		}

		const nextIndex = wrapIndex(this._lastIndex + 1, this._capacity)
		this.list[nextIndex] = item

		this._lastIndex = nextIndex
		if (this._firstIndex < 0) {
			this._firstIndex = nextIndex
		}
		else if (nextIndex === this._firstIndex) {
			this._firstIndex = wrapIndex(this._firstIndex + 1, this._capacity)
		}

		console.log({
			first: this._firstIndex,
			last: this._lastIndex
		})
		return Math.abs(this._lastIndex - this._firstIndex)
	}

	/**
	 * Removes the last item in the list
	 */
	pop(): T | undefined {
		if (this.list.length < this._capacity) {
			this._lastIndex = Math.max(0, this.list.length - 2)
			return this.list.pop()
		}

		const item = this.list[this._lastIndex]
		this.list[this._lastIndex] = undefined
		this._lastIndex--
		return item
	}

	*[Symbol.iterator]() {
		const list = this.list
		
		let index = this._firstIndex
		
		while (index < list.length) {
			yield list[index]

			index = wrapIndex(index + 1, this._capacity)
			if (index === this._lastIndex) {
				yield list[index]
				break
			}
		}
	}

	/**
	 * Gets the item at the given index, supporting negative values
	 * @param index 
	 */
	at(index: number): T | undefined {
		if (this.list.length < this._capacity) {
			return this.list.at(index)
		}

		if (index >= this._capacity) return undefined
		if (index < -this._capacity) return undefined
		if (index >= 0) {
			return this.list[wrapIndex(index + this._firstIndex, this._capacity)]
		}
		else {
			return this.list[wrapIndex(index + this._lastIndex, this._capacity)]
		}
	}

	get length() {
		if (this._lastIndex < 0 && this._firstIndex < 0) return 0
		if (this._firstIndex === this._lastIndex) return 1
		return Math.abs(this._lastIndex + 1 - this._firstIndex)
	}

	private indexToRelativeIndex(realIndex: number) {
		if (this._firstIndex > this._lastIndex) {
			
		}
		else {
			return realIndex - this._firstIndex
		}
	}
}
