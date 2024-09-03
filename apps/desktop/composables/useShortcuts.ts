import { useMagicKeys } from "@vueuse/core"
import { newSettingsPage } from "~/lib/utils/router"
import { platform } from "@tauri-apps/plugin-os"

export const useGoToSettingShortcuts = async () => {
	const { meta, comma, control, alt } = useMagicKeys()
	const _platform = await platform()
	watch([meta, comma, control, alt], ([meta, comma, control, alt]) => {

		switch (_platform) {
			case 'macos':
				if (meta && comma) {
					newSettingsPage()
				}
				break;
		
			default:
				if (control && comma) {
					newSettingsPage()
				}
				break;
		}
	})
}
