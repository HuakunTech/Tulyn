import type { TListItem } from "~/lib/types/list"

export interface IExtensionLoader {
	id: string
	extensionName: string
	onSelect: (item: TListItem) => Promise<void>
	load: () => Promise<void>
	$listItems: Ref<TListItem[]>
	$filteredListItems: ComputedRef<TListItem[]>
}
