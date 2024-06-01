import { ListItemType, IconType, TListItem, TCommand } from "tauri-plugin-jarvis-api/models";
import { systemCommands } from "tauri-plugin-jarvis-api/commands";
import { type IExtensionBase } from "./base";
import { dialog } from "jarvis-api/ui";
import { atom, type ReadableAtom } from "nanostores";

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
  $listItems: ReadableAtom<TListItem[]> = atom(systemCommandListItems);

  constructor() {
    this.extensionName = "System Commands";
  }
  load(): Promise<void> {
    return Promise.resolve();
  }
  default(): TListItem[] {
    return systemCommandListItems.slice(0, 5);
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
