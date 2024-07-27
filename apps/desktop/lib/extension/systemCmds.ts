import { ListItemType, TListItem } from "@/lib/types/list"
import { getSystemCommands } from "@kksh/api/commands"
import { IconType, SysCommand } from "@kksh/api/models"
import * as dialog from "@tauri-apps/plugin-dialog"
import { error } from "@tauri-apps/plugin-log"
import { ElNotification } from "element-plus"
import { atom, type ReadableAtom, type WritableAtom } from "nanostores"
import { v4 as uuidv4 } from "uuid"
import { parse, safeParse } from "valibot"
import { type IExtensionBase } from "./base"

export class SystemCommandExtension implements IExtensionBase {
	id: string = uuidv4()
	extensionName: string
	$listItems: WritableAtom<TListItem[]> = atom([])
	systemCommands: SysCommand[] = []
	systemCommandListItems: TListItem[] = []

	constructor() {
		this.extensionName = "System Commands"
	}

	async load(): Promise<void> {
		this.systemCommands = await getSystemCommands()
		this.systemCommandListItems = this.systemCommands
			.map((cmd) => {
				const candidate = {
					title: cmd.name,
					value: cmd.value,
					description: "System",
					type: ListItemType.enum.SystemCmd,
					icon: cmd.icon,
					keywords: cmd.keywords
				}
				const parseRes = safeParse(TListItem, candidate)
				if (parseRes.success) {
					return parseRes.output
				} else {
					error(`Failed to parse system command: ${cmd.name}; See console for more details`)
					console.error(`Failed to parse system command: ${cmd.name}`, candidate)
					console.error(parseRes.issues)
					return null
				}
			})
			.filter((item) => item !== null)

		setTimeout(() => {
			this.$listItems.set(this.systemCommandListItems)
		})
		return Promise.resolve()
	}
	default(): TListItem[] {
		return this.systemCommandListItems
	}
	async onSelect(item: TListItem): Promise<void> {
		const cmd = this.systemCommands.find((c) => c.value === item.value)
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
}
