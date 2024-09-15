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
	<div class="h-8 border absolute" data-tauri-drag-region></div>
	<h1 class="text-2xl font-bold text-center pt-4">Onboarding</h1>
	<GeneralTab />
	<Button size="sm" class="fixed bottom-4 right-4" @click="next">Next</Button>
</template>
