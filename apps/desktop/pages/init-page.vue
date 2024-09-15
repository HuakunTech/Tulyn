<script setup lang="ts">
import { getCurrentWindow } from "@tauri-apps/api/window"

const localePath = useLocalePath()
const appConfig = useAppConfigStore()

onMounted(async () => {
	await appConfig.init()
	getCurrentWindow().show()
	setTimeout(() => {
		if (appConfig.onBoarded) {
			navigateTo(localePath("/"))
		} else {
			navigateTo(localePath("/onboarding"))
		}
	}, 500)
})
</script>
<template>
	<FunDance />
</template>
