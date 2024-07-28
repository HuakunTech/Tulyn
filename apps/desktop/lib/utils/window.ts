import { getCurrent } from "@tauri-apps/api/window"

export function isInMainWindow() {
	return getCurrent().label == "main"
}
