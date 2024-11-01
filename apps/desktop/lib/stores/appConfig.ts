import { createStore, Store } from "@tauri-apps/plugin-store"

export function getPersistedAppConfigStore() {
	return createStore("appConfig.bin", {
		// we can save automatically after each store modification
		autoSave: true
	})
}
