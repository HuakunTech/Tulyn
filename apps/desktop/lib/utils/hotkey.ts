import { getAllWindows } from "@tauri-apps/api/window"
import { isRegistered, register, unregister } from "@tauri-apps/plugin-global-shortcut"
import { debug, info } from "@tauri-apps/plugin-log"
import { mapKeyToTauriKey } from "~/lib/utils/js"
import { useAppConfigStore } from "~/stores/appConfig"
import { sendNotificationWithPermission } from "./notification"

export async function registerAppHotkey(hotkeyStr: string) {
	if (await isRegistered(hotkeyStr)) {
		debug(`Hotkey (${hotkeyStr}) already registered`)
		await unregister(hotkeyStr)
	}
	info(`Registering hotkey: ${hotkeyStr}`)
	return register(hotkeyStr, async (e) => {
		if (e.state === "Released") {
			const wins = getAllWindows()
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
	debug("useRegisterAppShortcuts called")
	return new Promise<string>((resolve, reject) => {
		const appConfig = useAppConfigStore()
		const hotkey = appConfig.triggerHotkey
		if (!hotkey) {
			return reject(new Error("No hotkey set in app config"))
		}
		const hotkeyStr = hotkey.map(mapKeyToTauriKey).join("+")
		info(`Registering hotkey: ${hotkeyStr}`)
		registerAppHotkey(hotkeyStr)
			.then(() => resolve(hotkeyStr))
			.catch(reject)
	})
}
