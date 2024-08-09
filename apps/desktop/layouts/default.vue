<script setup lang="ts">
import { useGoToSettingShortcuts } from "@/composables/useShortcuts"
import { useTestDB } from "@/lib/dev/exp"
import { installBun } from "@/lib/utils/runtime"
import { Toaster } from "@kksh/vue/sonner"
import { Toaster as Toaster2 } from "@kksh/vue/toast"
import { TooltipProvider } from "@kksh/vue/tooltip"
import type { UnlistenFn } from "@tauri-apps/api/event"
import { attachConsole, debug, error, info, warn } from "@tauri-apps/plugin-log"
import { useRegisterAppShortcuts } from "~/lib/utils/hotkey"
import { initStores } from "~/lib/utils/stores"
import { listenToRefreshConfig } from "~/lib/utils/tauri-events"
import { useAppConfigStore } from "~/stores/appConfig"

const appConfig = useAppConfigStore()
let unlistenRefreshConfig: UnlistenFn
let detach: UnlistenFn
useGoToSettingShortcuts()
usePreventExit()
useTestDB()
unlistenRefreshConfig = await listenToRefreshConfig(async () => {
	await appConfig.init()
	appConfig.refreshWindowStyles()
	// useRegisterAppShortcuts()
})
onMounted(async () => {
	await appConfig.init()
	appConfig.refreshWindowStyles()
	useRegisterAppShortcuts()
		.then((hotkeyStr) => {
			info(`Shortcuts registered (${hotkeyStr})`)
		})
		.catch((err) => {
			console.warn(err)
		})
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
	<TooltipProvider>
		<main class="z-10 h-screen">
			<Toaster :rich-colors="true" :expand="true" />
			<Toaster2 />
			<slot />
		</main>
	</TooltipProvider>
</template>

<style>
.dark {
	color-scheme: dark;
}
</style>
