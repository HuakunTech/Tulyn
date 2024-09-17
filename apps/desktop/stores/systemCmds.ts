import { ListItemType, ListItemTypeEnum, TListItem } from "@/lib/types/list"
import { getSystemCommands } from "@kksh/api/commands"
import { IconEnum, IconType, SysCommand } from "@kksh/api/models"
import * as dialog from "@tauri-apps/plugin-dialog"
import { error } from "@tauri-apps/plugin-log"
import { filterListItem } from "~/lib/utils/search"
import { ElNotification } from "element-plus"
import { defineStore } from "pinia"
import { v4 as uuidv4 } from "uuid"
import { useAppStateStore } from "./appState"

export const useSystemCmdsStore = defineStore("system-cmds", () => {
	const systemCommands = ref<SysCommand[]>([])
	const $listItems = ref<TListItem[]>([])
	const appStateStore = useAppStateStore()
	const $filteredListItems = computed<TListItem[]>(() => {
		return appStateStore.searchTerm.length === 0
			? $listItems.value
			: filterListItem(appStateStore.searchTerm, $listItems.value)
	})

	async function load() {
		systemCommands.value = await getSystemCommands()
		$listItems.value = systemCommands.value
			.map((cmd) => {
				return {
					title: cmd.name,
					description: "System",
					type: ListItemTypeEnum.SystemCmd,
					identityFilter: true,
					keywords: cmd.keywords ?? [],
					flags: {
						isDev: false,
						isRemovable: false
					},
					icon: cmd.icon,
					value: {
						type: ListItemTypeEnum.SystemCmd,
						data: cmd.value
					}
				}
			})
			.filter((item) => item !== null)
	}

	async function onSelect(item: TListItem) {
		console.log(item)
		const cmd = systemCommands.value.find((c) => c.value === item.value.data)
		if (!cmd) {
			ElNotification({
				title: "Unexpected Error",
				message: `Command not found: ${item.value}`,
				type: "error"
			})
			return error(`Unexpected Error: Command not found: ${item.value}`)
		} else {
			let confirmed = true
			if (cmd.confirmRequired) {
				confirmed = await dialog.confirm(`Are you sure you want to "${item.title}"?`)
			}
			if (confirmed) {
				cmd.function()
			}
		}
	}

	setTimeout(() => {
		load()
	}, 100)

	return {
		id: uuidv4(),
		extensionName: "System Commands",
		$listItems,
		$filteredListItems,
		load,
		onSelect
	}
})
