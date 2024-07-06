import { TListItem } from "@jarvis/schema"
import { convertFileSrc } from "@tauri-apps/api/core"
import { ElNotification } from "element-plus"
import { atom, computed, type WritableAtom } from "nanostores"
import { getAllApps, refreshApplicationsList } from "tauri-plugin-jarvis-api/commands"
import { AppInfo } from "tauri-plugin-jarvis-api/models"
import { open } from "tauri-plugin-shellx-api"
import { type IExtensionBase } from "./base"

export function appInfoToListItem(app: AppInfo): TListItem {
  return {
    title: app.name,
    value: app.app_desktop_path,
    description: "",
    type: "Application",
    icon: app.icon_path
      ? { type: "remote-url", value: convertFileSrc(app.icon_path, "appicon") }
      : null,
    keywords: app.name.split(" "),
    identityFilter: false,
    flags: { isDev: false, isRemovable: false }
  }
}

export class AppsExtension implements IExtensionBase {
  $apps: WritableAtom<AppInfo[]> = atom([])
  extensionName = "Applications"
  // $listItems = atom<TListItem[]>([]);
  $listItems = computed(this.$apps, (apps) => apps.map((app) => appInfoToListItem(app)))

  load(): Promise<void> {
    return refreshApplicationsList()
      .then(() => getAllApps())
      .then((apps) => {
        this.$apps.set(apps)
        // this.$listItems.set(apps.map((app) => appInfoToListItem(app)));
      })
  }
  default(): TListItem[] {
    return []
  }
  onSelect(item: TListItem): Promise<void> {
    const foundApp = this.$apps.value?.find((app) => app.app_desktop_path === item.value)
    if (!foundApp) {
      ElNotification({
        title: "App Not Found",
        type: "warning",
        position: "bottom-right"
      })
      return Promise.resolve()
    } else {
      open(foundApp.app_desktop_path)
      return Promise.resolve()
    }
  }
}
