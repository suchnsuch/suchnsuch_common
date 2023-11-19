import { wait, PromiseQueue } from '../src/async'

describe('Promise Queue', () => {
	it('Will execute requests, in order', async () => {

		const stuff: string[] = []
	
		const queue = new PromiseQueue()
		queue.enqueue(async () => {
			await wait(100)
			stuff.push('Hello')
		})
		const end = queue.start()
	
		queue.enqueue(async () => {
			await wait(10)
			stuff.push('World')
		})
	
		await end
	
		expect(stuff).toEqual(['Hello', 'World'])
	})
})
