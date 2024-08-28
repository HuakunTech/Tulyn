import { SettingsWindowLabel } from "@/lib/constants"
import { $appState } from "@/lib/stores/appState"
import { getAllWebviewWindows, WebviewWindow } from "@tauri-apps/api/webviewWindow"

export async function newSettingsPage() {
	const allWins = await getAllWebviewWindows()
	const existingWin = allWins.find((win) => win.label === SettingsWindowLabel)
	if (existingWin) {
		existingWin.show()
		return existingWin
	} else {
		return new WebviewWindow(SettingsWindowLabel, {
			url: "/settings",
			title: "",
			hiddenTitle: true,
			width: 1000,
			height: 800,
			titleBarStyle: $appState.get().platform === "macos" ? "overlay" : undefined,
			// visible: true
			visible: false
		})
	}
}
