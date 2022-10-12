import { firstOfType } from '../src/iterables'

describe('Types', () => {
	test('Can find custom type', () => {
		class Foo {}
		class Boo {}

		const list = ['some', 'things', new Foo(), new Boo()]

		expect(firstOfType(list, Foo)).toBe(list[2])
		expect(firstOfType(list, Boo)).toBe(list[3])
	})
})
