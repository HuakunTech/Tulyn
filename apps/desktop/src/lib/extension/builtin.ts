import type { ReadableAtom, WritableAtom } from "nanostores";
import type { IExtensionBase } from "./base";
import { TListItem, ListItemType } from "tauri-plugin-jarvis-api/models";
import { atom } from "nanostores";
import { ElMessage } from "element-plus";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

type BuiltinCmd = {
  name: string;
  description: string;
  function: () => Promise<void>;
};

const builtinCmds: BuiltinCmd[] = [
  {
    name: "Store",
    description: "Go to Extension Store",
    function: () => {
      window.location.href = "/extension-store";
      return Promise.resolve();
    },
  },
];

function genListItemValue(name: string): string {
  return "builtin:" + name;
}

const buildinCmdsListItems: TListItem[] = builtinCmds.map(
  (cmd): TListItem => ({
    title: cmd.name,
    value: genListItemValue(cmd.name),
    description: cmd.description,
    type: ListItemType.Enum["Built-In Command"],
    icon: {
      value: "streamline:store-2-solid",
      type: "iconify",
    },
    flags: { isDev: false, isRemovable: false },
    keywords: ["builtin"],
    identityFilter: true,
  }),
);

export class BuiltinCmds implements IExtensionBase {
  extensionName: string = "Builtin Commands";
  $listItems: WritableAtom<TListItem[]>;
  constructor() {
    this.$listItems = atom(buildinCmdsListItems);
  }

  load(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Get the default list items for the extension when search term is empty
   */
  default(): TListItem[] {
    return buildinCmdsListItems;
  }

  onSelect(item: TListItem): Promise<void> {
    console.log("onSelect", item);

    const cmd = builtinCmds.find((cmd) => genListItemValue(cmd.name) === item.value);
    if (cmd) {
      return cmd.function();
    } else {
      ElMessage.error(`Command (${item.title}) not found`);
      return Promise.reject(`Command (${item.title}) not found`);
    }
  }
}
