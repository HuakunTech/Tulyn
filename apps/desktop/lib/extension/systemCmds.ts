import { ElNotification } from "element-plus"
import { dialog } from "jarvis-api/ui"
import { atom, type ReadableAtom, type WritableAtom } from "nanostores"
import { getSystemCommands } from "tauri-plugin-jarvis-api/commands"
import { IconType, ListItemType, TCommand, TListItem } from "tauri-plugin-jarvis-api/models"
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
      TListItem.parse({
        title: cmd.name,
        value: cmd.value,
        description: "System",
        type: ListItemType.Enum["System Command"],
        icon: {
          value: cmd.icon,
          type: IconType.Enum.iconify
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
    console.log("load sys cmds", items)
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
