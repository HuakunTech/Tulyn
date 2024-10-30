<script setup lang="ts">
import { useGoToSettingShortcuts } from "@/composables/useShortcuts"
import { useTestDB } from "@/lib/dev/exp"
import { listenToKillProcessEvent, listenToRecordExtensionProcessEvent } from "@kksh/api/events"
import { Toaster } from "@kksh/vue/sonner"
import { Toaster as Toaster2 } from "@kksh/vue/toast"
import { TooltipProvider } from "@kksh/vue/tooltip"
import type { UnlistenFn } from "@tauri-apps/api/event"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { attachConsole, debug, error, info, warn } from "@tauri-apps/plugin-log"
import { initDeeplink } from "~/lib/init/deeplink"
import { useRegisterAppShortcuts } from "~/lib/utils/hotkey"
import { initStores } from "~/lib/utils/stores"
import {
	listenToRefreshConfig,
	listenToRefreshDevExt,
	listenToRefreshExt
} from "~/lib/utils/tauri-events"
import { useAppConfigStore } from "~/stores/appConfig"
import { useWindowExtMapStore } from "~/stores/windowExtMap"
import { fixPathEnv } from "tauri-plugin-shellx-api"

const appConfig = useAppConfigStore()
const appWindow = getCurrentWebviewWindow()
const extStore = useExtensionStore()
const isMainWindow = appWindow.label === "main"
let unlistenRefreshConfig: UnlistenFn
let unlistenRefreshExtensionList: UnlistenFn
let detach: UnlistenFn
let unlistenRecordExtensionProcessEvent: UnlistenFn
let unlistenKillProcessEvent: UnlistenFn
useTestDB()
const rtConfig = useRuntimeConfig()
const windowExtMapStore = useWindowExtMapStore()

usePreventExit()

onMounted(async () => {
	if (!isMainWindow) {
		return
	} else {
		unlistenRecordExtensionProcessEvent = await listenToRecordExtensionProcessEvent(
			async (event) => {
				console.log("record extension process event", event)
				windowExtMapStore.registerProcess(event.payload.windowLabel, event.payload.pid)
				console.log(windowExtMapStore.windowExtMap)
			}
		)
	}
	unlistenKillProcessEvent = await listenToKillProcessEvent((event) => {
		console.log("kill process event", event)
		windowExtMapStore.unregisterProcess(event.payload.pid)
	})
	if (!rtConfig.public.isDev) {
		document.addEventListener("contextmenu", (event) => {
			event.preventDefault()
		})
	}

	initDeeplink()
	await appConfig.init()
	appConfig.refreshWindowStyles()
	useGoToSettingShortcuts()
	unlistenRefreshConfig = await listenToRefreshConfig(async () => {
		debug("Refreshing config")
		await appConfig.init()
		appConfig.refreshWindowStyles()
		initStores()
		// useRegisterAppShortcuts()
	})

	unlistenRefreshExtensionList = await listenToRefreshExt(async () => {
		debug("Refreshing extension list")
		extStore.load()
	})

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

onUnmounted(() => {
	unlistenRecordExtensionProcessEvent?.()
	unlistenKillProcessEvent?.()
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
