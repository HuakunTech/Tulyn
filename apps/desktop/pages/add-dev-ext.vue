<script setup lang="ts">
import DragNDrop from "@/components/DragNDrop.vue"
import AddDevExtForm from "@/components/forms/add-dev-ext.vue"
import { cn } from "@/lib/utils"
import { IconEnum } from "@kksh/api/models"
import { AutoForm } from "@kksh/vue/auto-form"
import { Button } from "@kksh/vue/button"
import { Card } from "@kksh/vue/card"
import { Input } from "@kksh/vue/input"
import { Separator } from "@kksh/vue/separator"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { downloadDir } from "@tauri-apps/api/path"
import { open as openFileSelector } from "@tauri-apps/plugin-dialog"
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
		<p class="prose">
			This page allows you to add a development extension to the extension manager. You can either
			pick a local extension folder or drag and drop the extension file here. 
			<!-- The filename must end with <code>.tgz</code> or <code>.kunkun</code> -->
		</p>
		<p class="prose">
			Or you can install an extension from a remote URL. The URL should be a direct link to the
			file.
		</p>
		<AddDevExtForm />
		<br />
	</main>
</template>
