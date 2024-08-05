import type { TListItem } from "../types/list"

export function filterListItem(query: string, items: TListItem[]) {
	return items.filter((item) => {
		const titleMatch = item.title.toLowerCase().includes(query.toLowerCase())
		const keywordMatch = item.keywords
			.map((keyword) => keyword.toLowerCase().includes(query.toLowerCase()))
			.some((x) => x)
		return titleMatch || keywordMatch
	})
}
