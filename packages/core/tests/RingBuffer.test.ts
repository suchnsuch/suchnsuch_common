import RingBuffer from '../src/RingBuffer'

describe('Initialization', () => {
	it('Should initialize with capacity', () => {
		const ring = new RingBuffer<string>(4)
		expect((ring as any)._capacity).toEqual(4)
		expect((ring as any)._firstIndex).toEqual(-1)
		expect((ring as any)._lastIndex).toEqual(-1)
		expect(ring.length).toEqual(0)
	})

	it('Should initialize with an iterable', () => {
		const ring = new RingBuffer<string>(['one', 'two'])
		expect((ring as any)._capacity).toEqual(2)
		expect((ring as any)._firstIndex).toEqual(0)
		expect((ring as any)._lastIndex).toEqual(1)
		expect(ring.length).toEqual(2)
	})

	it('Should initialize with a capacity and iterable', () => {
		const ring = new RingBuffer<string>(4, ['one', 'two', 'three'])
		expect((ring as any)._capacity).toEqual(4)
		expect((ring as any)._firstIndex).toEqual(0)
		expect((ring as any)._lastIndex).toEqual(2)
		expect(ring.length).toEqual(3)
	})
})

describe('Adding items', () => {
	it('Should be able to add items', () => {
		const ring = new RingBuffer<string>(4)
		expect(ring.push('item1')).toEqual(0)
		expect(ring.length).toEqual(1)

		expect(ring.push('item2')).toEqual(1)
		expect(ring.length).toEqual(2)
	})

	it('Should be able to add items past capacity and wrap', () => {
		const ring = new RingBuffer<string>(4)
		expect(ring.push('item1')).toEqual(0)
		expect(ring.push('item2')).toEqual(1)
		expect(ring.push('item3')).toEqual(2)
		expect(ring.push('item4')).toEqual(3)
		expect(ring.push('item5')).toEqual(3)
		expect(ring.length).toEqual(4)
	})

	it('Should be able to iterate over items', () => {
		const ring = new RingBuffer<string>(4)
		ring.push('1')
		ring.push('2')

		expect([...ring]).toEqual(['1', '2'])
	})
})
