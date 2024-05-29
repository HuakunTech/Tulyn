import { IconType, ListItemType, TCommand, TListItem } from "jarvis-api";
import { ExtensionBase } from "./base";
import { systemCommands } from "@/lib/commands/system";
import { dialog } from "jarvis-api/ui";

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

export class SystemCommandExtension extends ExtensionBase {
  constructor() {
    super("System Commands");
  }

  load(): Promise<void> {
    console.log(systemCommandListItems);
    return Promise.resolve();
  }
  getInitialListItems(): TListItem[] {
    return systemCommandListItems.slice(0, 10);
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
  search(searchTerm: string): TListItem[] {
    return systemCommandListItems.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }
}
