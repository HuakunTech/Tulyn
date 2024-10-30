import { platform } from "@tauri-apps/plugin-os"
import { useMagicKeys } from "@vueuse/core"
import { newSettingsPage } from "~/lib/utils/router"

export const useGoToSettingShortcuts = async () => {
	const { meta, comma, control, alt } = useMagicKeys()
	const _platform = platform()
	watch([meta, comma, control, alt], ([meta, comma, control, alt]) => {
		switch (_platform) {
			case "macos":
				if (meta && comma) {
					newSettingsPage()
				}
				break

			default:
				if (control && comma) {
					newSettingsPage()
				}
				break
		}
	})
}
