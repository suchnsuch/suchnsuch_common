import { wait, PromiseQueue, ReadWritePromiseQueue } from '../src/async'

describe('Promise Queue', () => {
	it('Will execute requests, in order', async () => {

		const stuff: string[] = []
	
		const queue = new PromiseQueue()
		queue.enqueue(async () => {
			await wait(100)
			stuff.push('Hello')
		})

		queue.enqueue(async () => {
			await wait(10)
			stuff.push('World')
		})
	
		await queue.onComplete
	
		expect(stuff).toEqual(['Hello', 'World'])
	})
})

describe('Read Write Promise Queue', () => {
	it('Will execute read tasks simultaneously', async () => {
		const stuff = new Array<string>()
		const queue = new ReadWritePromiseQueue();

		queue.queueRead(async () => {
			await wait(20)
			stuff.push('World')
		})

		queue.queueRead(async () => {
			await wait(10)
			stuff.push('Hello')
		})

		await queue.onComplete

		expect(stuff).toEqual(['Hello', 'World'])
	})

	it('Will execute write tasks in order', async () => {
		const stuff = new Array<string>()
		const queue = new ReadWritePromiseQueue();

		queue.queueWrite(async () => {
			await wait(20)
			stuff.push('Hello')
		})

		queue.queueWrite(async () => {
			await wait(10)
			stuff.push('World')
		})

		await queue.onComplete

		expect(stuff).toEqual(['Hello', 'World'])
	})

	it('Will wait to start write tasks until all read tasks are complete', async () => {
		const stuff = new Array<string>()
		const queue = new ReadWritePromiseQueue();

		const one = queue.queueRead(async () => {
			await wait(50)
			stuff.push('World')
		})

		queue.queueRead(async () => {
			await wait(40)
			stuff.push('Hello')
		})

		queue.queueWrite(async () => {
			await wait(1)
			stuff.push('Wazzup!?')
		})

		await queue.onComplete

		expect(stuff).toEqual(['Hello', 'World', 'Wazzup!?'])
	})

	it('Will start groups of simultaneous reads after a write completes', async () => {
		const stuff = new Array<string>()
		const queue = new ReadWritePromiseQueue();

		queue.queueWrite(async () => {
			await wait(50)
			stuff.push('Write')
		})

		queue.queueRead(async () => {
			await wait(1)
			stuff.push('Read 1')
		})

		queue.queueRead(async () => {
			await wait(2)
			stuff.push('Read 2')
		})
		
		await queue.onComplete

		expect(stuff).toEqual(['Write', 'Read 1', 'Read 2'])
	})
})
