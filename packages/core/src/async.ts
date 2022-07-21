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