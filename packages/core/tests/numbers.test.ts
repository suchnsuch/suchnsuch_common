import { wrapIndex } from '../src/numbers'

describe('wrapIndex()', () => {
	it('Should not affect numbers in range', () => {
		expect(wrapIndex(0, 5)).toEqual(0)
		expect(wrapIndex(2, 5)).toEqual(2)
		expect(wrapIndex(4, 5)).toEqual(4)
	})

	it('Should wrap around the top', () => {
		expect(wrapIndex(5, 5)).toEqual(0)
		expect(wrapIndex(6, 5)).toEqual(1)
		expect(wrapIndex(8, 5)).toEqual(3)
	})

	it('Should wrap around the bottom', () => {
		expect(wrapIndex(-1, 5)).toEqual(4)
		expect(wrapIndex(-2, 5)).toEqual(3)
		expect(wrapIndex(-4, 5)).toEqual(1)
		expect(wrapIndex(-5, 5)).toEqual(0)
	})
})
