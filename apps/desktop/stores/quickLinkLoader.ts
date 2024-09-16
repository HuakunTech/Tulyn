import { IconEnum } from "@kksh/api/models"
import { getAllQuickLinkCommands } from "~/lib/db/quicklink"
import type { TListItem } from "~/lib/types/list"
import { dbCmdToTListItem } from "~/lib/utils/command"
import { filterListItem } from "~/lib/utils/search"
import { defineStore } from "pinia"
import { v4 as uuidv4 } from "uuid"

export function genListItemValue(name: string) {
	return "quicklink:" + name
}

export const useQuicklinkLoader = defineStore("quicklink-cmd-loader", () => {
	const appStateStore = useAppStateStore()
	const $listItems = ref<TListItem[]>([])
	const $filteredListItems = computed<TListItem[]>(() => {
		return appStateStore.searchTerm.length === 0
			? $listItems.value
			: filterListItem(appStateStore.searchTerm, $listItems.value)
	})

	async function load() {
		console.log("load quicklinks")
		const quickLinkCmds = await getAllQuickLinkCommands()
		$listItems.value = quickLinkCmds.map(dbCmdToTListItem).map((item) => {
			item.icon = {
				type: IconEnum.Iconify,
				value: "material-symbols:link"
			}
			return item
		})
		console.warn("quicklinks", $listItems.value)
	}

	async function onSelect(item: TListItem): Promise<void> {
		// const cmd = builtinCmds.find((cmd) => genListItemValue(cmd.name) === item.value)
		// if (cmd) {
		// 	return cmd.function()
		// } else {
		// 	ElMessage.error(`Command (${item.title}) not found`)
		// 	return Promise.reject(`Command (${item.title}) not found`)
		// }
	}

	return {
		id: uuidv4(),
		load,
		extensionName: "Builtin Commands",
		$listItems,
		$filteredListItems,
		onSelect
	}
})
