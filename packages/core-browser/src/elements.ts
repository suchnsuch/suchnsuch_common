export function selectSelfOrParent(element: Element | null, selector: string) {
	if (!element) return null
	do {
		if (element.matches(selector)) {
			return element
		}
		element = element.parentElement
	} while (element)
	return null
}

export function selectSelfOrPreviousSibling(element: Element | null, selector: string) {
	if (!element) return null
	do {
		if (element.matches(selector)) {
			return element
		}
		element = element.previousElementSibling
	} while (element)
}

export function anyChild(children: NodeListOf<ChildNode>, func: (node: ChildNode) => boolean): boolean {
	for (let i = 0; i < children.length; i++) {
		if (func(children.item(i))) {
			return true
		}
	}
	return false
}