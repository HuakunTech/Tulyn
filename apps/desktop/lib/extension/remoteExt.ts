import { ListItemType, TListGroup, TListItem } from "@/lib/types/list"
import { db } from "@kksh/api/commands"
import { CmdType, ExtCmd, Icon, IconType } from "@kksh/api/models"
import { WebviewWindow } from "@tauri-apps/api/webviewWindow"
import { info } from "@tauri-apps/plugin-log"
import { ElMessage } from "element-plus"
import { atom, computed, task, type ReadableAtom, type WritableAtom } from "nanostores"
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
import type { IExtensionBase } from "./base"

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

export class RemoteExtension implements IExtensionBase {
	id: string = uuidv4()
	extensionName: string = "Remote Extensions"
	remoteExtensions: RemoteCmd[]
	$listItems: WritableAtom<TListItem[]>
	remoteExtDbId: number | undefined

	constructor() {
		this.remoteExtensions = []
		this.$listItems = atom([])
	}

	setRemoteExtensions(remoteCmds: RemoteCmd[]) {
		this.remoteExtensions = remoteCmds
		this.$listItems.set(remoteCmds.map(convertToListItem))
	}

	async load(): Promise<void> {
		const dbRemoteExt = await db.getExtRemote()
		this.remoteExtDbId = dbRemoteExt.extId
		const cmds = await db.getCommandsByExtId(dbRemoteExt.extId)
		const remoteCmds = cmds.map(convertRawCmdToRemoteExt)
		this.setRemoteExtensions(remoteCmds)
	}

	default(): TListItem[] {
		return this.$listItems.get()
	}

	groups(): TListGroup[] {
		return [
			{
				title: this.extensionName,
				identifier: "remote-ext",
				type: "Remote Extension",
				icon: parse(Icon, {
					type: "iconify",
					value: "mdi:remote"
				}),
				items: this.default(),
				flags: { isDev: true, isRemovable: false }
			}
		]
	}

	findRemoteExt(cmdId: number): RemoteCmd | undefined {
		return this.remoteExtensions.find((ext) => ext.id === cmdId)
	}

	async addRemoteExt(ext: Omit<RemoteCmd, "id">) {
		if (!this.remoteExtDbId) {
			await this.load() // remoteExtDbId should be set in load()
		}
		// Allow duplicate remote extension, there is no unique identifier.
		// User can always remove the duplicate in settings.
		console.log({
			extId: parse(number(), this.remoteExtDbId),
			name: ext.name,
			type: CmdType.enum.Remote,
			data: ext.url
		})

		await db.createCommand({
			extId: parse(number(), this.remoteExtDbId),
			name: ext.name,
			cmdType: CmdType.enum.Remote,
			data: ext.url
		})
	}

	removeRemoteCmd(cmdId: number) {
		return db.deleteCommandById(cmdId)
	}

	onSelect(item: TListItem): Promise<void> {
		const ext = this.findRemoteExt(parseInt(item.value))
		if (!ext) {
			return Promise.reject("Remote Extension not found")
		}
		// TODO: rethink the design of remote extension, how it works
		new WebviewWindow("ext-remote", {
			url: ext.url
		})
		return Promise.resolve()
	}
}
