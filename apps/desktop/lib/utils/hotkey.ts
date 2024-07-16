import { $appConfig, setDevExtLoadUrl, setShowInTray } from "@/lib/stores/appConfig"
import { WebviewWindow } from "@tauri-apps/api/webviewWindow"
import { getAll, getCurrent } from "@tauri-apps/api/window"
import { isRegistered, register, unregister } from "@tauri-apps/plugin-global-shortcut"
import { debug, warn } from "@tauri-apps/plugin-log"
import { useMagicKeys } from "@vueuse/core"
import { SettingsWindowLabel } from "~/lib/constants"
import { $appState } from "~/lib/stores/appState"
import { mapKeyToTauriKey } from "~/lib/utils/js"
import { sendNotificationWithPermission } from "./notification"

export async function registerAppHotkey(hotkeyStr: string) {
  if (await isRegistered(hotkeyStr)) {
    debug(`Hotkey (${hotkeyStr}) already registered`)
    await unregister(hotkeyStr)
  }
  return register(hotkeyStr, async (e) => {
    if (e.state === "Released") {
      const wins = getAll()
      const mainWin = wins.find((w) => w.label === "main")
      if (!mainWin) {
        return sendNotificationWithPermission(
          "No main window found",
          "Please open main window first"
        )
      }
      if (await mainWin.isVisible()) {
        mainWin.hide()
      } else {
        mainWin.show()
      }
    }
  })
}

/**
 * Run this in main window, will show current window
 */
export const useRegisterAppShortcuts = () => {
  return new Promise<string>((resolve, reject) => {
    const hotkey = $appConfig.get().triggerHotkey
    if (!hotkey) {
      return reject(new Error("No hotkey set in app config"))
    }
    const hotkeyStr = hotkey.map(mapKeyToTauriKey).join("+")
    registerAppHotkey(hotkeyStr)
      .then(() => resolve(hotkeyStr))
      .catch(reject)
  })
}
