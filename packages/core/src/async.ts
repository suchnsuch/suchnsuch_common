export function wait(time: number = 0): Promise<void> {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, time)
	})
}

export function requestCallbackOnIdle(callback: () => void, timeout = 500) {
	if (typeof window !== 'undefined' && (window as any).requestIdleCallback) {
		(window as any).requestIdleCallback(callback, { timeout })
	}
	else {
		// Fallback for other environments, default to 0
		setTimeout(callback, 0)
	}
}

export type PromiseStarter<T> = () => Promise<T>

type PromiseQueueItem<T> = {
	starter: PromiseStarter<T>
	resolve: (result: T | PromiseLike<T>) => void
	reject: (error: any) => void
}

export class PromiseQueue {
	tasks: PromiseQueueItem<any>[] = []
	index: number = -1

	enqueue<T>(starter: PromiseStarter<T>): Promise<T> {
		const item: Partial<PromiseQueueItem<T>> = {
			starter
		}

		// Create a new promise so that this item can resolve when finished
		const promise = new Promise<T>((resolve, reject) => {
			item.resolve = resolve
			item.reject = reject
		})

		this.tasks.push(item as PromiseQueueItem<T>)

		return promise
	}

	async start() {
		if (this.index < 0) {
			this.index = 0
		}

		while (this.index < this.tasks.length) {
			const item = this.tasks[this.index]
	
			let result;
			try {
				result = await item.starter()
			}
			catch (e) {
				item.reject(e)
				continue;
			}
	
			item.resolve(result)
	
			this.index++
		}
	}
}

