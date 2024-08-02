export type NestedMessages = {
	[key: string]: string | NestedMessages
}

export type FlattenedMessages = {
	[key: string]: string
}

export function flattenMessages(obj: NestedMessages, prefix = ""): FlattenedMessages {
	let result: FlattenedMessages = {}

	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const value = obj[key]
			const newKey = prefix ? `${prefix}.${key}` : key

			if (typeof value === "string") {
				result[newKey] = value
			} else {
				result = { ...result, ...flattenMessages(value, newKey) }
			}
		}
	}

	return result
}
