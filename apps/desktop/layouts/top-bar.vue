<script setup lang="ts">
import { Toaster } from "@kksh/vue/sonner"
import { initStores } from "~/lib/utils/stores"
import { listenToRefreshConfig } from "~/lib/utils/tauri-events"
import { useAppConfigStore } from "~/stores/appConfig"

const appConfig = useAppConfigStore()
listenToRefreshConfig(async () => {
	console.log("listenToRefreshConfig triggered")

	await appConfig.init()
	appConfig.refreshWindowStyles()
	// useRegisterAppShortcuts()
})
onMounted(async () => {
	await appConfig.init()
	appConfig.refreshWindowStyles()
	// useWatchAppConfig()
	appConfig.watch()
	initStores()
})
</script>

<template>
	<main class="flex h-screen flex-col">
		<Toaster :rich-colors="true" />
		<Topbar />
		<slot />
	</main>
</template>
