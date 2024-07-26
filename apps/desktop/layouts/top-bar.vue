<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner"
// import { useRegisterAppShortcuts } from "~/lib/utils/hotkey"
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
})
</script>

<template>
  <main class="flex h-screen flex-col">
    <Toaster :rich-colors="true" />
    <Topbar />
    <slot />
  </main>
</template>
