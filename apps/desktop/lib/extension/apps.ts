import { TListItem } from "@jarvis/schema"
import { convertFileSrc } from "@tauri-apps/api/core"
import { info, warn } from "@tauri-apps/plugin-log"
import { ElNotification } from "element-plus"
import { os } from "jarvis-api/ui"
import { atom, computed, type WritableAtom } from "nanostores"
import { getAllApps, refreshApplicationsList } from "tauri-plugin-jarvis-api/commands"
import { AppInfo } from "tauri-plugin-jarvis-api/models"
import { executeBashScript, open } from "tauri-plugin-shellx-api"
import { type IExtensionBase } from "./base"

export function appInfoToListItem(app: AppInfo & { app_path_exe: string }): TListItem {
  return {
    title: app.name,
    value: app.app_path_exe,
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
  $listItems = computed(this.$apps, (apps) =>
    apps
      .filter((app) => !!app.app_path_exe)
      .map((app) => appInfoToListItem(app as AppInfo & { app_path_exe: string }))
  )

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
    return os.platform().then((platform) => {
      if (platform === "macos") {
        open(item.value)
      } else if (platform === "linux") {
        executeBashScript(item.value)
      } else if (platform === "windows") {
        open(item.value)
      } else {
        ElNotification({
          title: "Unsupported Platform",
          type: "warning",
          message: `Platform ${platform} is not supported`
        })
        warn(`Unsupported platform: ${platform}`)
      }
    })

    // const foundApp = this.$apps.value?.find((app) => app.app_desktop_path === item.value)
    // if (!foundApp) {
    //   ElNotification({
    //     title: "App Not Found",
    //     type: "warning",
    //     position: "bottom-right"
    //   })
    //   return Promise.resolve()
    // } else {
    //   return os.platform().then((platform) => {
    //     if (platform === "macos") {
    //       open(foundApp.app_desktop_path)
    //     } else if (platform === "linux") {
    //       if (foundApp.app_path_exe) {
    //         console.log("Opening", foundApp.app_path_exe)
    //         executeBashScript(foundApp.app_path_exe)
    //         // open(foundApp.app_path_exe)
    //       } else {
    //         ElNotification({
    //           title: "Not Executable",
    //           type: "warning",
    //           message: "This application has no executable"
    //         })
    //         warn(`App has no executable: ${JSON.stringify(foundApp)}`)
    //       }
    //     } else if (platform === "windows") {
    //       if (foundApp.app_path_exe) {
    //         // console.log("Opening", foundApp.app_path_exe)
    //         open(item.value)
    //         info(`Launching App ${foundApp.app_path_exe}`)
    //       }
    //     } else {
    //       ElNotification({
    //         title: "Unsupported Platform",
    //         type: "warning",
    //         message: `Platform ${platform} is not supported`
    //       })
    //       warn(`Unsupported platform: ${platform}`)
    //     }
    //   })
    // }
  }
}
