import { SettingsWindowLabel } from "@/lib/constants"
import { $appState } from "@/lib/stores/appState"
import { WebviewWindow } from "@tauri-apps/api/webviewWindow"

export function newSettingsPage() {
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
