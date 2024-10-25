<script setup lang="ts">
import { Button } from "@kksh/vue/button"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { onKeyStroke } from "@vueuse/core"

definePageMeta({
	layout: "empty"
})

onKeyStroke("Escape", (e) => {
	e.preventDefault()
	navigateTo("/")
})

function onBack() {
	navigateTo("/")
}
</script>
<template>
	<main class="h-screen w-screen">
		<Button variant="outline" size="icon" class="absolute left-2 top-2 z-50" @click="onBack">
			<ArrowLeftIcon />
		</Button>
		<div class="absolute z-40 h-screen w-screen" data-tauri-drag-region />
		<FunDance class="w-full" />
	</main>
</template>
