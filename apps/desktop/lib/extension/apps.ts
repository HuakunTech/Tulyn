import { $appState } from "@/lib/stores/appState"
import { convertFileSrc } from "@tauri-apps/api/core"
import { info, warn } from "@tauri-apps/plugin-log"
import { getAllApps, refreshApplicationsList } from "@tulyn/api/commands"
import { AppInfo, IconEnum } from "@tulyn/api/models"
import { ListItemTypeEnum, TListItem } from "@tulyn/schema"
import { ElNotification } from "element-plus"
import { atom, computed, type WritableAtom } from "nanostores"
import { executeBashScript, open } from "tauri-plugin-shellx-api"
import { type IExtensionBase } from "./base"

/**
 * On MacOS, we use .app folder as unique value to identify an application
 * On Windows, we use app_path_exe. Sometimes in a single app_desktop_path, there are multiple app_path_exe (e.g. adobe acrobat)
 * On Linux, we use app_desktop_path, each app should have a single .desktop file
 * @param app
 * @returns
 */
export function computeItemValue(app: AppInfo & { app_path_exe: string }): string {
  const platform = $appState.get().platform
  if (platform === "windows") {
    return app.app_path_exe
  } else if (platform === "linux" || platform === "macos") {
    return app.app_desktop_path
  } else {
    warn(`Unsupported platform: ${platform}`)
    return ""
  }
}

export function appInfoToListItem(app: AppInfo & { app_path_exe: string }): TListItem {
  return {
    title: app.name,
    value: computeItemValue(app),
    description: "",
    type: ListItemTypeEnum.Application,
    icon: app.icon_path
      ? { type: IconEnum.RemoteUrl, value: convertFileSrc(app.icon_path, "appicon") }
      : null,
    keywords: app.name.split(" "),
    identityFilter: false,
    flags: { isDev: false, isRemovable: false }
  }
}

export class AppsExtension implements IExtensionBase {
  apps: AppInfo[] = []
  extensionName = "Applications"
  $listItems: WritableAtom<TListItem[]> = atom([])

  setApps(apps: AppInfo[]): void {
    this.apps = apps
    this.$listItems.set(
      apps
        .filter((app) => !!app.app_path_exe)
        .map((app) => appInfoToListItem(app as AppInfo & { app_path_exe: string }))
    )
  }

  load(): Promise<void> {
    return refreshApplicationsList()
      .then(() => getAllApps())
      .then((apps) => {
        this.setApps(apps)
      })
  }
  default(): TListItem[] {
    return []
  }
  onSelect(item: TListItem): Promise<void> {
    const platform = $appState.get().platform
    const foundApp = this.apps.find((app) => app.app_desktop_path === item.value)
    if (platform === "macos") {
      if (foundApp?.app_desktop_path) {
        return open(foundApp.app_desktop_path)
      } else {
        warn(`Cannot find app at ${item.value}`)
        ElNotification({
          title: "Error",
          type: "error",
          message: `Cannot find app at ${item.value}`
        })
        return Promise.resolve()
      }
    } else if (platform === "linux") {
      if (foundApp?.app_path_exe) {
        return executeBashScript(foundApp.app_path_exe).then(() => Promise.resolve())
      } else {
        warn(`Cannot find app at ${item.value}`)
        ElNotification({
          title: "Error",
          type: "error",
          message: `Cannot find app at ${item.value}`
        })
        return Promise.resolve()
      }
    } else if (platform === "windows") {
      return open(item.value)
    } else {
      ElNotification({
        title: "Unsupported Platform",
        type: "warning",
        message: `Platform ${platform} is not supported`
      })
      warn(`Unsupported platform: ${platform}`)
      return Promise.resolve()
    }
  }
}
