<script setup lang="ts">
import DragNDrop from "@/components/DragNDrop.vue"
import AddDevExtForm from "@/components/forms/add-dev-ext.vue"
import DeveloperWarning from "@/components/settings/Developer/Warning.vue"
import { AutoForm, AutoFormField } from "@kksh/vue/auto-form"
import { Button } from "@kksh/vue/button"
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@kksh/vue/form"
import { Input } from "@kksh/vue/input"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { open as openDialog } from "@tauri-apps/plugin-dialog"
import { exists } from "@tauri-apps/plugin-fs"
import { onKeyStroke } from "@vueuse/core"
import { installTarball } from "~/lib/utils/install"
import { useAppConfigStore } from "~/stores/appConfig"
// import { useForm } from "vee-validate"
import { toast } from "vue-sonner"
import { z } from "zod"

// const formSchema = z.object({
// 	filePath: z.string()
// })
const route = useRoute()
const appConfig = useAppConfigStore()
const filePath = ref<string | undefined>(route.query.path as string)
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

// function onSubmit(e: Event) {
// 	e.preventDefault()
// }

// const { handleSubmit } = useForm({
// 	validationSchema: formSchema
// })

// const onSubmit = handleSubmit((values) => {
// 	toast({
// 		title: "You submitted the following values:",
// 		description: h(
// 			"pre",
// 			{ class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
// 			h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
// 		)
// 	})
// })

async function onSubmit(e: Event) {
	e.preventDefault()
	if (!filePath.value) return toast.error("File is required")
	const exists_ = await exists(filePath.value)
	if (!exists_) return toast.error("File does not exist")
	if (!appConfig.devExtensionPath) {
		toast.error("Please set the dev extension path first")
		navigateTo("/set-dev-ext-path")
		return
	}
	installTarball(filePath.value, appConfig.devExtensionPath)
		.then(() => {
			toast.success("Extension installed successfully")
			onBack()
		})
		.catch((err) => {
			toast.error({
				title: "Failed to install extension",
				description: err
			})
		})
}

async function onPickFile() {
	const result = await openDialog({
		directory: false,
		filters: [
			{
				name: "Tarball",
				extensions: ["kunkun"]
			}
		]
	})
	if (result) {
		filePath.value = result
	}
}
</script>
<template>
	<main class="container flex h-screen w-screen flex-col gap-2 pt-10">
		<Button variant="outline" size="icon" class="absolute left-4 top-4 z-50" @click="onBack">
			<ArrowLeftIcon />
		</Button>
		<h2 class="text-2xl font-bold">Add Dev Extension</h2>
		<DeveloperWarning />
		<form v-if="route.query.path" flex flex-col gap-2 @submit="onSubmit">
			<div flex gap-1>
				<Input placeholder="File Path" v-model="filePath" />
				<Button @click="onPickFile">Pick File</Button>
			</div>
			<Button class="w-fit text-right" type="submit">Install</Button>
		</form>
		<div v-else>
			<p class="text-xs">
				There are 4 options to install an extension in developer mode. Either load it from your
				local tarball file, a tarball remote URL, npm package name or load from a remote URL.
			</p>
			<AddDevExtForm />
		</div>
		<br />
	</main>
</template>
