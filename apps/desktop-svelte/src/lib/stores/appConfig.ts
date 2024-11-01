import { getExtensionsFolder } from "@/constants"
import { PersistedAppConfig, type AppConfig } from "@/types/appConfig"
import * as tauriPath from "@tauri-apps/api/path"
import { remove } from "@tauri-apps/plugin-fs"
import { debug, error } from "@tauri-apps/plugin-log"
import * as os from "@tauri-apps/plugin-os"
import { load } from "@tauri-apps/plugin-store"
import { get, writable, type Writable } from "svelte/store"
import * as v from "valibot"

export const defaultAppConfig: AppConfig = {
	isInitialized: false,
	platform: os.platform(),
	theme: "zinc",
	radius: 0.5,
	triggerHotkey: null,
	lightMode: "auto",
	launchAtLogin: true,
	showInTray: true,
	devExtensionPath: null,
	extensionPath: undefined,
	hmr: false,
	hideOnBlur: true,
	extensionAutoUpgrade: true,
	joinBetaProgram: false,
	onBoarded: false
}

function createAppConfig(): Writable<AppConfig> & {
	init: () => Promise<void>
	setRadius: (radius: number) => void
} {
	const { subscribe, update, set } = writable<AppConfig>(defaultAppConfig)

	async function init() {
		debug("Initializing app config")
		const appDataDir = await tauriPath.appDataDir()
		// const appConfigPath = await tauriPath.join(appDataDir, "appConfig.json")
		// debug(`appConfigPath: ${appConfigPath}`)
		const persistStore = await load("kk-config.json", { autoSave: true })
		const loadedConfig = await persistStore.get("config")
		const parseRes = v.safeParse(PersistedAppConfig, loadedConfig)
		if (parseRes.success) {
			console.log("Parse Persisted App Config Success", parseRes.output)
			const extensionPath = await tauriPath.join(appDataDir, "extensions")
			update((config) => ({ ...config, ...parseRes.output, isInitialized: true, extensionPath }))
		} else {
			error("Failed to parse app config, going to remove it and reinitialize")
			console.error(v.flatten<typeof PersistedAppConfig>(parseRes.issues))
			await persistStore.clear()
			await persistStore.set("config", v.parse(PersistedAppConfig, defaultAppConfig))
			await persistStore.save()
		}

		subscribe(async (config) => {
			console.log("Saving app config", config)
			await persistStore.set("config", config)
		})
	}

	function setRadius(radius: number) {
		update((config) => ({ ...config, radius }))
	}

	return {
		setRadius,
		init,
		subscribe,
		update,
		set
	}
}

export const appConfig = createAppConfig()
