import { useAppStateStore } from "@/stores/appState"
import { db } from "@kksh/api/commands"
import { Ext, ExtCmd, ExtPackageJsonExtra, IconEnum } from "@kksh/api/models"
import { getAllQuickLinkCommands } from "~/lib/db/quicklink"
import {
	CmdListItemValue,
	ExtCmdListItemValue,
	ListItemTypeEnum,
	type TListItem
} from "~/lib/types/list"
import { filterListItem } from "~/lib/utils/search"
import { defineStore } from "pinia"
import { open } from "tauri-plugin-shellx-api"
import { v4 as uuidv4 } from "uuid"
import { boolean, literal, number, object, parse, string, type InferOutput } from "valibot"
import { z } from "zod"

export type QuickLinkQuery = {
	value: string
	name: string
}

/**
 * Given some link like https://google.com/search?q={argument}&query={query}
 * Find {argument} and {query}
 */
export function findAllArgsInLink(link: string): string[] {
	const regex = /\{([^}]+)\}/g
	const matches = [...link.matchAll(regex)]
	return matches.map((match) => match[1])
}

export const useQuicklinkLoader = defineStore("quicklink-store", () => {
	const appStateStore = useAppStateStore()
	const quickLinkInputs = ref<QuickLinkQuery[]>([])
	const $listItems = ref<TListItem[]>([])
	const $filteredListItems = computed<TListItem[]>(() => {
		return appStateStore.searchTerm.length === 0
			? $listItems.value
			: filterListItem(appStateStore.searchTerm, $listItems.value)
	})

	async function load() {
		const quickLinkCmds = await getAllQuickLinkCommands()
		const extQuickLinks = await db.getExtQuickLinks()
		$listItems.value = quickLinkCmds.map((cmd) => ({
			title: cmd.name,
			description: "",
			type: ListItemTypeEnum.QuickLink,
			identityFilter: true,
			keywords: ["quicklink"],
			flags: {
				isDev: false,
				isRemovable: false
			},
			icon: {
				type: IconEnum.Iconify,
				value: "material-symbols:link"
			},
			value: {
				type: ListItemTypeEnum.QuickLink,
				data: {
					extIdentifier: extQuickLinks.identifier,
					cmdName: cmd.name,
					cmdId: cmd.cmdId,
					data: cmd.data
				}
			}
		}))
	}

	async function onSelect(item: TListItem): Promise<void> {
		console.log("quicklink onSelect", item)
		const args = findAllArgsInLink(parse(ExtCmdListItemValue, item.value.data).data)
		console.log(args)

		// console.log(parse(ExtCmdListItemValue, item.value.data))

		// item.value is database command ID, can be used to get command from database
		// const cmd = await db.getCommandById(parseInt(item.value))
		// console.log(cmd)
		// const qlinkVal = parse(QuickLinkValue, JSON.parse(item.value))
		// console.log(item)
		// const args = findAllArgsInLink(item.value.data)
		// console.log(args)
		// open(qlinkVal.value)
		// const cmd = builtinCmds.find((cmd) => genListItemValue(cmd.name) === item.value)
		// if (cmd) {
		// 	return cmd.function()
		// } else {
		// 	ElMessage.error(`Command (${item.title}) not found`)
		// 	return Promise.reject(`Command (${item.title}) not found`)
		// }
	}

	function onQuicklinkEnter(item: CmdListItemValue) {
		console.log("quicklink enter", item)
		const parsedExtItemValue = parse(ExtCmdListItemValue, item.data)
		let qlink = z.string().parse(parsedExtItemValue.data)
		const args = findAllArgsInLink(qlink)
		// console.log("args", args)
		// console.log("quickLinkInputs", quickLinkInputs.value)
		for (const arg of quickLinkInputs.value) {
			console.log(`replace all {${arg.name}} with ${arg.value}`)
			qlink = qlink.replaceAll(`{${arg.name}}`, arg.value)
		}
		quickLinkInputs.value = []
		appStateStore.searchTermSync = ""
		appStateStore.searchTerm = ""
		open(qlink)
	}

	return {
		id: uuidv4(),
		load,
		quickLinkInputs,
		onQuicklinkEnter,
		extensionName: "Quick Link Commands",
		$listItems,
		$filteredListItems,
		onSelect
	}
})
