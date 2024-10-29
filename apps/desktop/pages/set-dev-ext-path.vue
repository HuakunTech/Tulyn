<script setup lang="ts">
import DevExtPathForm from "@/components/settings/Developer/DevExtPathForm.vue"
import { Button } from "@kksh/vue/button"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { onKeyStroke } from "@vueuse/core"

onKeyStroke("Escape", (e) => {
	e.preventDefault()
	onBack()
})

function onBack() {
	navigateTo("/")
}
</script>
<template>
	<main class="container h-screen w-screen pt-10">
		<div class="absolute left-0 top-0 h-10 w-screen" data-tauri-drag-region />
		<Button variant="outline" size="icon" class="absolute left-2 top-2 z-50" @click="onBack">
			<ArrowLeftIcon />
		</Button>
		<h2 class="text-2xl font-bold">Set Dev Extension Path</h2>
		<p>This is where your extensions will be installed.</p>
		<DevExtPathForm />
	</main>
</template>
