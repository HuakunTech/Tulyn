import { DebugWindowLabel, DevWindowLabel, SettingsWindowLabel } from "@/lib/constants"
import { newSettingsPage } from "@/lib/utils/router"
import { IconType, ListItemType, TListItem } from "@jarvis/schema"
import { getAll as getAllWindows, WebviewWindow } from "@tauri-apps/api/webviewWindow"
import { ElMessage, ElNotification } from "element-plus"
import type { ReadableAtom, WritableAtom } from "nanostores"
import { atom } from "nanostores"
import type { IExtensionBase } from "./base"

const rtConfig = useRuntimeConfig()

type BuiltinCmd = {
  name: string
  description: string
  iconifyIcon: string
  function: () => Promise<void>
}

const builtinCmds: BuiltinCmd[] = [
  {
    name: "Store",
    iconifyIcon: "streamline:store-2-solid",
    description: "Go to Extension Store",
    function: () => {
      navigateTo("/extension-store")
      return Promise.resolve()
    }
  },
  {
    name: "Settings",
    iconifyIcon: "solar:settings-linear",
    description: "Open Settings",
    function: () => {
      const windows = getAllWindows()
      const found = windows.find((w) => w.label === SettingsWindowLabel)
      if (found) {
        ElNotification.error("Settings Page is already open")
      } else {
        newSettingsPage()
      }
      return Promise.resolve()
    }
  }
]

if (rtConfig.public.isDev) {
  builtinCmds.push({
    name: "Open Dev Page",
    iconifyIcon: "fa6-brands:dev",
    description: "Open Dev Page",
    function: () => {
      const windows = getAllWindows()
      const found = windows.find((w) => w.label === DevWindowLabel)
      if (found) {
        ElNotification.error("Debug Page is already open")
      } else {
        new WebviewWindow(DevWindowLabel, {
          url: "/dev",
          width: 1000,
          height: 800
        })
      }
      return Promise.resolve()
    }
  })
  builtinCmds.push({
    name: "Open Debug Page",
    iconifyIcon: "carbon:debug",
    description: "Open Debug Page",
    function: () => {
      const windows = getAllWindows()
      const found = windows.find((w) => w.label === DebugWindowLabel)
      if (found) {
        ElNotification.error("Debug Page is already open")
      } else {
        new WebviewWindow(DebugWindowLabel, {
          url: "/debug",
          width: 1000,
          height: 800,
          titleBarStyle: "overlay"
        })
      }
      return Promise.resolve()
    }
  })
}

function genListItemValue(name: string): string {
  return "builtin:" + name
}

const buildinCmdsListItems: TListItem[] = builtinCmds.map(
  (cmd): TListItem => ({
    title: cmd.name,
    value: genListItemValue(cmd.name),
    description: cmd.description,
    type: ListItemType.enum.BuiltInCmd,
    icon: {
      value: cmd.iconifyIcon,
      type: IconType.enum.iconify
    },
    flags: { isDev: false, isRemovable: false },
    keywords: ["builtin"],
    identityFilter: true
  })
)

export class BuiltinCmds implements IExtensionBase {
  extensionName: string = "Builtin Commands"
  $listItems: WritableAtom<TListItem[]>
  constructor() {
    this.$listItems = atom([])
    setTimeout(() => {
      this.$listItems.set(buildinCmdsListItems)
    }, 50)
  }

  load(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Get the default list items for the extension when search term is empty
   */
  default(): TListItem[] {
    return buildinCmdsListItems
  }

  onSelect(item: TListItem): Promise<void> {
    const cmd = builtinCmds.find((cmd) => genListItemValue(cmd.name) === item.value)
    if (cmd) {
      return cmd.function()
    } else {
      ElMessage.error(`Command (${item.title}) not found`)
      return Promise.reject(`Command (${item.title}) not found`)
    }
  }
}
