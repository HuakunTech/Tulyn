<script setup lang="ts">
import { useGoToSettingShortcuts } from "@/composables/useShortcuts"
import { useTestDB } from "@/lib/dev/exp"
import { listenToRecordExtensionProcessEvent } from "@kksh/api/events"
import { Toaster } from "@kksh/vue/sonner"
import { Toaster as Toaster2 } from "@kksh/vue/toast"
import { TooltipProvider } from "@kksh/vue/tooltip"
import type { UnlistenFn } from "@tauri-apps/api/event"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { attachConsole, debug, error, info, warn } from "@tauri-apps/plugin-log"
import { initDeeplink } from "~/lib/init/deeplink"
import { useRegisterAppShortcuts } from "~/lib/utils/hotkey"
import { initStores } from "~/lib/utils/stores"
import { listenToRefreshConfig } from "~/lib/utils/tauri-events"
import { useAppConfigStore } from "~/stores/appConfig"
import { useWindowExtMapStore } from "~/stores/windowExtMap"
import { fixPathEnv } from "tauri-plugin-shellx-api"

const appConfig = useAppConfigStore()
const appWindow = getCurrentWebviewWindow()
const isMainWindow = appWindow.label === "main"
let unlistenRefreshConfig: UnlistenFn
let detach: UnlistenFn
useGoToSettingShortcuts()
usePreventExit()
useTestDB()
unlistenRefreshConfig = await listenToRefreshConfig(async () => {
	debug("Refreshing config")
	await appConfig.init()
	appConfig.refreshWindowStyles()
	initStores()
	// useRegisterAppShortcuts()
})


const windowExtMapStore = useWindowExtMapStore()
if (appWindow.label === "main") {
	let unlistenRecordExtensionProcessEvent: UnlistenFn = await listenToRecordExtensionProcessEvent(
		async (event) => {
			console.log("record extension process event", event)
			windowExtMapStore.registerProcess(event.payload.windowLabel, event.payload.pid)
			console.log(windowExtMapStore.windowExtMap)
		}
	)
}
onMounted(async () => {
	if (!isMainWindow) {
		return
	}
	initDeeplink()
	await appConfig.init()
	appConfig.refreshWindowStyles()
	useRegisterAppShortcuts()
		.then((hotkeyStr) => {
			info(`Shortcuts registered (${hotkeyStr})`)
		})
		.catch((err) => {
			console.warn(err)
		})
	fixPathEnv()
	// installBun()
	//   .then((bunVersion) => {
	//     info(`Bun installed (${bunVersion})`)
	//   })
	//   .catch((err) => {
	//     warn(err.message)
	//     // toast.error(err.message)
	//   })
	detach = await attachConsole()
	appConfig.watch()
	initStores()
})
</script>

<template>
	<main class="z-10 flex h-screen flex-col">
		<Toaster :rich-colors="true" :expand="true" />
		<Toaster2 />
		<slot />
	</main>
</template>

<style>
.dark {
	color-scheme: dark;
}
</style>
