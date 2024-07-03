import { ListItemType, IconType, TListItem, TCommand } from "tauri-plugin-jarvis-api/models";
import { getSystemCommands } from "tauri-plugin-jarvis-api/commands";
import { type IExtensionBase } from "./base";
import { dialog } from "jarvis-api/ui";
import { atom, type ReadableAtom, type WritableAtom } from "nanostores";
import { ElNotification } from "element-plus";

const systemCommands = await getSystemCommands();

export const systemCommandListItems: TListItem[] = systemCommands.map((cmd) =>
  TListItem.parse({
    title: cmd.name,
    value: cmd.value,
    description: "System",
    type: ListItemType.Enum["System Command"],
    icon: {
      value: cmd.icon,
      type: IconType.Enum.iconify,
    },
    keywords: cmd.keywords,
  }),
);

export class SystemCommandExtension implements IExtensionBase {
  extensionName: string;
  $listItems: WritableAtom<TListItem[]> = atom([]);

  constructor() {
    this.extensionName = "System Commands";
  }

  load(): Promise<void> {
    setTimeout(() => {
      this.$listItems.set(systemCommandListItems);
    });
    return Promise.resolve();
  }
  default(): TListItem[] {
    const items = systemCommandListItems.slice(0, 5);
    console.log("load sys cmds", items);
    // ElNotification(`Loaded ${items.length} system commands`);
    return systemCommandListItems;
  }
  async onSelect(item: TListItem): Promise<void> {
    const cmd = systemCommands.find((c) => c.value === item.value) as TCommand;
    let confirmed = true;
    if (cmd.confirmRequired) {
      confirmed = await dialog.confirm(`Are you sure you want to "${item.title}"?`);
    }
    if (confirmed) {
      cmd.function();
    }
  }
}
