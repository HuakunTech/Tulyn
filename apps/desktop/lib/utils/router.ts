import { SettingsWindowLabel } from "@/lib/constants"
import { $appState } from "@/lib/stores/appState"
import { getAll, WebviewWindow } from "@tauri-apps/api/webviewWindow"

export function newSettingsPage() {
	const allWins = getAll()
	const existingWin = allWins.find((win) => win.label === SettingsWindowLabel)
	if (existingWin) {
		existingWin.show()
	} else {
		new WebviewWindow(SettingsWindowLabel, {
			url: "/settings",
			title: "",
			hiddenTitle: true,
			width: 1000,
			height: 800,
			titleBarStyle: $appState.get().platform === "macos" ? "overlay" : undefined,
			visible: true
			// visible: false
		})
	}
}
