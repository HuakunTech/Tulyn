import { IconType, ListItemType, TListItem } from "@jarvis/schema"
import * as dialog from "@tauri-apps/plugin-dialog"
import { ElNotification } from "element-plus"
import { atom, type ReadableAtom, type WritableAtom } from "nanostores"
import { getSystemCommands } from "tauri-plugin-jarvis-api/commands"
import { TCommand } from "tauri-plugin-jarvis-api/models"
import { parse } from "valibot"
import { type IExtensionBase } from "./base"

export class SystemCommandExtension implements IExtensionBase {
  extensionName: string
  $listItems: WritableAtom<TListItem[]> = atom([])
  systemCommands: TCommand[] = []
  systemCommandListItems: TListItem[] = []

  constructor() {
    this.extensionName = "System Commands"
  }

  async load(): Promise<void> {
    this.systemCommands = await getSystemCommands()
    this.systemCommandListItems = this.systemCommands.map((cmd) =>
      parse(TListItem, {
        title: cmd.name,
        value: cmd.value,
        description: "System",
        type: ListItemType.enum.SystemCmd,
        icon: {
          value: cmd.icon,
          type: IconType.enum.iconify
        },
        keywords: cmd.keywords
      })
    )

    setTimeout(() => {
      this.$listItems.set(this.systemCommandListItems)
    })
    return Promise.resolve()
  }
  default(): TListItem[] {
    const items = this.systemCommandListItems.slice(0, 5)
    // ElNotification(`Loaded ${items.length} system commands`);
    return this.systemCommandListItems
  }
  async onSelect(item: TListItem): Promise<void> {
    const cmd = this.systemCommands.find((c) => c.value === item.value) as TCommand
    let confirmed = true
    if (cmd.confirmRequired) {
      confirmed = await dialog.confirm(`Are you sure you want to "${item.title}"?`)
    }
    if (confirmed) {
      cmd.function()
    }
  }
}
