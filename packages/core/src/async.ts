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

interface PromiseQueueItem<T> {
	start: PromiseStarter<T>
	resolve?: (result: T | PromiseLike<T>) => void
	reject?: (error: any) => void

	name?: string
	describe?: (indent: string) => string
}

function describeQueueItem(item: PromiseQueueItem<unknown>, indent: string) {
	if (item.describe) {
		return item.describe(indent)
	}
	else {
		return (item.name ?? 'Some Task')
	}
}

function appendQueueItem<T>(starter: PromiseStarter<T>, tasks: PromiseQueueItem<any>[], name?: string): Promise<T> {
	const item: Partial<PromiseQueueItem<T>> = {
		start: starter
	}

	if (name) item.name = name

	// Create a new promise so that this item can resolve when finished
	const promise = new Promise<T>((resolve, reject) => {
		item.resolve = resolve
		item.reject = reject
	})

	tasks.push(item as PromiseQueueItem<T>)

	return promise
}

class BaseQueue {
	protected tasks: PromiseQueueItem<any>[] = []
	protected index: number = 0

	protected _complete: Promise<void> | null = null

	protected async start() {
		while (this.index < this.tasks.length) {
			const item = this.tasks[this.index]
	
			let result
			try {
				result = await item.start()
			}
			catch (e) {
				if (item.reject) {
					item.reject(e)
				}
				continue;
			}
	
			if (item.resolve) {
				item.resolve(result)
			}
	
			this.index++
		}

		this._complete = null
		this.index = 0
		this.tasks = []
	}

	get onComplete() { return this._complete }
	get length() {
		return this.tasks.length - this.index
	}

	// Creates a formatted visualization of the current items in the queue
	describe(indent: string) {
		let result = 'Queue (length ' + this.length + '):\n'

		for (let i = this.index; i < this.tasks.length; i++) {
			const task = this.tasks[i]
			if (!task) continue

			result += indent + ' - ' + describeQueueItem(task, indent + '    ') + '\n'
		}

		return result
	}
}

export class PromiseQueue extends BaseQueue {
	enqueue<T>(starter: PromiseStarter<T>): Promise<T> {
		const promise = appendQueueItem(starter, this.tasks)

		if (this._complete === null) {
			this._complete = this.start()
		}

		return promise
	}
}

enum ReadSetState {
	Unstarted,
	Active,
	Closed
}

interface ReadSetItem<T> extends PromiseQueueItem<T> {
	promise: Promise<T>
}

class ReadSet implements PromiseQueueItem<void> {

	private state: ReadSetState = ReadSetState.Unstarted
	private tasks: ReadSetItem<any>[] = []

	// Don't expose the resolve, that's for us to call
	private _resolve?: ((result: void | PromiseLike<void>) => void) | undefined

	appendTask<T>(starter: PromiseStarter<T>, name?: string): Promise<T> {
		const promise = appendQueueItem(starter, this.tasks, name)

		if (this.state === ReadSetState.Active) {
			this.startItem(this.tasks.at(-1) as ReadSetItem<any>)
		}

		return promise
	}

	private startItem(item: ReadSetItem<any>) {
		item.promise = item.start()
		.then(result => {
			if (item.resolve) {
				item.resolve(result)
			}
		})
		.catch(err => {
			if (item.reject) {
				item.reject(err)
			}
		})
		.finally(() => this.finishItem(item))
	}

	private finishItem(item: ReadSetItem<any>) {
		const index = this.tasks.indexOf(item)
		if (index >= 0) {
			this.tasks.splice(index, 1)
		}

		if (this._resolve && this.tasks.length === 0) {
			this._resolve()
		}
	}

	start() {
		return new Promise<void>((resolve, reject) => {
			this.state = ReadSetState.Active
			this._resolve = resolve

			for (const task of this.tasks) {
				this.startItem(task)
			}
		})
	}

	closeout() {
		if (this.state !== ReadSetState.Active) {
			console.warn('Closed out read group when it was: ', this.state)
		}

		this.state = ReadSetState.Closed
		if (this._resolve && this.tasks.length === 0) {
			this._resolve()
		}
	}

	describe(indent: string) {
		let result = 'ReadQueue (length ' + this.tasks.length + '):\n'

		const subIndent = indent + '    '
		for (const task of this.tasks) {
			result += subIndent + ' - ' + describeQueueItem(task, subIndent) + '\n'
		}

		return result
	}
}

export class ReadWritePromiseQueue extends BaseQueue {

	queueRead<T>(starter: PromiseStarter<T>, name?: string): Promise<T> {
		const last = this.tasks.at(-1)
		if (last instanceof ReadSet) {
			return last.appendTask(starter, name)
		}

		const set = new ReadSet()
		this.tasks.push(set as PromiseQueueItem<void>)

		const promise = set.appendTask(starter, name)

		if (this._complete === null) {
			this._complete = this.start()
		}

		return promise
	}

	queueWrite<T>(starter: PromiseStarter<T>, name?: string): Promise<T> {
		const last = this.tasks.at(-1)
		if (last instanceof ReadSet) {
			last.closeout()
		}

		const promise = appendQueueItem(starter, this.tasks, name)

		if (this._complete === null) {
			this._complete = this.start()
		}

		return promise
	}
}


