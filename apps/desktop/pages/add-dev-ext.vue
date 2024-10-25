<script setup lang="ts">
import DragNDrop from "@/components/DragNDrop.vue"
import AddDevExtForm from "@/components/forms/add-dev-ext.vue"
import DeveloperWarning from "@/components/settings/Developer/Warning.vue"
import { Button } from "@kksh/vue/button"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { onKeyStroke } from "@vueuse/core"

definePageMeta({
	layout: "empty"
})

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
		<Button variant="outline" size="icon" class="absolute left-4 top-4 z-50" @click="onBack">
			<ArrowLeftIcon />
		</Button>
		<h2 class="text-2xl font-bold">Add Dev Extension</h2>
		<div my-4 flex flex-col gap-2>
			<DeveloperWarning />
			<p class="text-xs">
				There are 4 options to install an extension in developer mode. Either load it from your
				local tarball file, a tarball remote URL, npm package name or load from a remote URL.
			</p>
		</div>
		<AddDevExtForm />
		<br />
	</main>
</template>
