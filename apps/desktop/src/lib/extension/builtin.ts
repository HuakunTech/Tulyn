import type { ReadableAtom, WritableAtom } from "nanostores";
import type { IExtensionBase } from "./base";
import { TListItem, ListItemType } from "tauri-plugin-jarvis-api/models";
import { atom } from "nanostores";
import { ElMessage, ElNotification } from "element-plus";
import { WebviewWindow, getAll as getAllWindows } from "@tauri-apps/api/webviewWindow";
import { DebugWindowLabel, SettingsWindowLabel } from "@/lib/constants";

type BuiltinCmd = {
  name: string;
  description: string;
  iconifyIcon: string;
  function: () => Promise<void>;
};

const builtinCmds: BuiltinCmd[] = [
  {
    name: "Store",
    iconifyIcon: "streamline:store-2-solid",
    description: "Go to Extension Store",
    function: () => {
      window.location.href = "/extension-store";
      return Promise.resolve();
    },
  },
  {
    name: "Settings",
    iconifyIcon: "solar:settings-linear",
    description: "Open Settings",
    function: () => {
      const windows = getAllWindows();
      const found = windows.find((w) => w.label === SettingsWindowLabel);
      if (found) {
        ElNotification.error("Settings Page is already open");
      } else {
        new WebviewWindow(SettingsWindowLabel, {
          url: "/settings",
          width: 1000,
          height: 800,
          titleBarStyle: "overlay",
        });
      }
      return Promise.resolve();
    },
  },
  {
    name: "Open Debug Page",
    iconifyIcon: "carbon:debug",
    description: "Open Debug Page",
    function: () => {
      const windows = getAllWindows();
      const found = windows.find((w) => w.label === DebugWindowLabel);
      if (found) {
        ElNotification.error("Debug Page is already open");
      } else {
        new WebviewWindow(DebugWindowLabel, {
          url: "/debug",
          width: 1000,
          height: 800,
          titleBarStyle: "overlay",
        });
      }
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
      value: cmd.iconifyIcon,
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
    const cmd = builtinCmds.find((cmd) => genListItemValue(cmd.name) === item.value);
    if (cmd) {
      return cmd.function();
    } else {
      ElMessage.error(`Command (${item.title}) not found`);
      return Promise.reject(`Command (${item.title}) not found`);
    }
  }
}
