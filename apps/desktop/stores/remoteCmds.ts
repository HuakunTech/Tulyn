import { ListItemType, TListGroup, TListItem } from "@/lib/types/list"
import { db } from "@kksh/api/commands"
import { CmdType, ExtCmd, Icon, IconType } from "@kksh/api/models"
import { WebviewWindow } from "@tauri-apps/api/webviewWindow"
import { info } from "@tauri-apps/plugin-log"
import { filterListItem } from "~/lib/utils/search"
import { ElMessage } from "element-plus"
import { atom, task, type ReadableAtom, type WritableAtom } from "nanostores"
import { defineStore } from "pinia"
import { v4 as uuidv4 } from "uuid"
import {
	array,
	minLength,
	number,
	object,
	parse,
	pipe,
	safeParse,
	string,
	url,
	uuid,
	type InferOutput
} from "valibot"
import { useAppStateStore } from "./appState"

export const RemoteCmd = object({
	name: pipe(string(), minLength(1)),
	id: number(),
	url: pipe(string(), url()),
	triggerCmds: pipe(array(string()), minLength(1))
})

export type RemoteCmd = InferOutput<typeof RemoteCmd>
export const RemoteExtState = array(RemoteCmd)
export type RemoteExtState = InferOutput<typeof RemoteExtState>

function convertRawCmdToRemoteExt(rawExt: ExtCmd): RemoteCmd {
	return {
		name: rawExt.name,
		id: rawExt.cmdId,
		url: rawExt.data,
		triggerCmds: rawExt.alias ? [rawExt.alias, "remote"] : ["remote"]
	}
}

function convertToListItem(rawExt: RemoteCmd): TListItem {
	return {
		title: rawExt.name,
		value: rawExt.id.toString(),
		description: "Remote Extension",
		type: ListItemType.enum.RemoteCmd,
		icon: {
			type: IconType.enum.RemoteUrl,
			value: rawExt.url + "/favicon.ico"
		},
		keywords: ["remote", ...rawExt.triggerCmds],
		identityFilter: false,
		flags: { isDev: true, isRemovable: true }
	}
}

export const useRemoteCmdStore = defineStore("remote-cmds", () => {
	const extensionName = "Builtin Commands"
	const remoteExtensions = ref<RemoteCmd[]>([])
	const remoteExtDbId = ref<number | undefined>()
	const appStateStore = useAppStateStore()

	function setRemoteExtensions(remoteCmds: RemoteCmd[]) {
		remoteExtensions.value = remoteCmds
	}

	const $listItems = computed<TListItem[]>(() => remoteExtensions.value.map(convertToListItem))
	const $filteredListItems = computed<TListItem[]>(() => {
		return appStateStore.searchTerm.length === 0
			? $listItems.value
			: filterListItem(appStateStore.searchTerm, $listItems.value)
	})
	async function load() {
		const dbRemoteExt = await db.getExtRemote()
		remoteExtDbId.value = dbRemoteExt.extId
		const cmds = await db.getCommandsByExtId(dbRemoteExt.extId)
		setRemoteExtensions(cmds.map(convertRawCmdToRemoteExt))
	}

	function findRemoteExt(cmdId: number): RemoteCmd | undefined {
		return remoteExtensions.value.find((ext) => ext.id === cmdId)
	}

	function groups(): TListGroup[] {
		return [
			{
				title: extensionName,
				identifier: "remote-ext",
				type: "Remote Extension",
				icon: parse(Icon, {
					type: "iconify",
					value: "mdi:remote"
				}),
				items: $listItems.value,
				flags: { isDev: true, isRemovable: false }
			}
		]
	}

	async function addRemoteExt(ext: Omit<RemoteCmd, "id">) {
		if (!remoteExtDbId.value) {
			await load() // remoteExtDbId should be set in load()
		}
		// Allow duplicate remote extension, there is no unique identifier.
		// User can always remove the duplicate in settings.
		console.log({
			extId: parse(number(), remoteExtDbId.value),
			name: ext.name,
			type: CmdType.enum.Remote,
			data: ext.url
		})

		await db.createCommand({
			extId: parse(number(), remoteExtDbId.value),
			name: ext.name,
			cmdType: CmdType.enum.Remote,
			data: ext.url
		})
	}

	function removeRemoteCmd(cmdId: number) {
		return db.deleteCommandById(cmdId)
	}

	function onSelect(item: TListItem): Promise<void> {
		const ext = findRemoteExt(parseInt(item.value))
		if (!ext) {
			return Promise.reject("Remote Extension not found")
		}
		// TODO: rethink the design of remote extension, how it works
		new WebviewWindow("ext-remote", {
			url: ext.url
		})
		return Promise.resolve()
	}

	return {
		id: uuidv4(),
		extensionName,
		$listItems,
		$filteredListItems,
		load,
		groups,
		setRemoteExtensions,
		findRemoteExt,
		addRemoteExt,
		removeRemoteCmd,
		onSelect
	}
})
