<script setup lang="ts">
import GeneralTab from "@/components/settings/GeneralTab.vue"
import { Button } from "@kksh/vue/button"

const appConfig = useAppConfigStore()
const next = () => {
	appConfig.setOnBoarded(true)
	navigateTo("/")
}
</script>
<template>
	<div class="h-full grow">
		<div class="absolute h-8 border" data-tauri-drag-region></div>
		<h1 class="pt-4 text-center text-2xl font-bold">Onboarding</h1>
		<GeneralTab />
		<Button size="sm" class="fixed bottom-4 right-4" @click="next">Next</Button>
	</div>
</template>
