import { firstOfType, zip, zipMap } from '../src/iterables'

describe('Types', () => {
	test('Can find custom type', () => {
		class Foo {}
		class Boo {}

		const list = ['some', 'things', new Foo(), new Boo()]

		expect(firstOfType(list, Foo)).toBe(list[2])
		expect(firstOfType(list, Boo)).toBe(list[3])
	})
})

describe('Zips', () => {
	test('Zipping two lists', () => {
		const a = [1, 2, 3, 4]
		const b = ['one', 'two', 'three', 'four']

		const result: string[] = []
		zip([a, b], (a, b) => result.push(b + a))

		expect(result).toEqual([
			'one1', 'two2', 'three3', 'four4'
		])
	})

	test('Zip mapping', () => {
		const a = [4, 3, 2, 1]
		const b = ['one', 'two', 'three', 'four']

		const result = zipMap([a, b], (a, b) => b + a)
		expect(result).toEqual([
			'one4', 'two3', 'three2', 'four1'
		])
	})
})
