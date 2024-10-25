<script setup lang="ts">
import DragNDrop from "@/components/DragNDrop.vue"
import { cn } from "@/lib/utils"
import { IconEnum } from "@kksh/api/models"
import { AutoForm, AutoFormField } from "@kksh/vue/auto-form"
import { Button } from "@kksh/vue/button"
import { Card } from "@kksh/vue/card"
import { Input } from "@kksh/vue/input"
import { Separator } from "@kksh/vue/separator"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { downloadDir } from "@tauri-apps/api/path"
import { open as openFileSelector } from "@tauri-apps/plugin-dialog"
import { onKeyStroke } from "@vueuse/core"
import { installDevExtensionDir, installTarball, installTarballUrl } from "~/lib/utils/install"
import { useAppConfigStore } from "~/stores/appConfig"
import { useExtensionStore } from "~/stores/extension"
import { toast } from "vue-sonner"
import { z } from "zod"

const extStore = useExtensionStore()
const appConfig = useAppConfigStore()
const dragging = ref(false)
const formSchema = z.object({
	url: z.string().url()
})

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

function onSubmit(data: z.infer<typeof formSchema>) {
	// data.url
}

async function onPickLocalExtensionFolder() {
	const selectedDir = await openFileSelector({
		directory: true
	})
	if (!selectedDir) {
		return ElMessage.warning("No Directory Selected")
	}
}

async function handleDragNDropInstall(paths: string[]) {
	dragging.value = false
	console.log(paths)
}

async function pickExtFolders() {
	const selected = await openFileSelector({
		directory: true,
		multiple: true // allow install multiple extensions at once
	})
	if (!selected) {
		return ElMessage.warning("No File Selected")
	}
	for (const dir of selected) {
		await installDevExtensionDir(dir)
			.then((manifest) => {
				console.log(manifest)
			})
			.catch((err) => {
				ElNotification.warning({
					title: "Failed to install extension",
					message: err
				})
			})
	}
	extStore.load()
}

async function pickExtFiles() {
	if (!appConfig.devExtensionPath) {
		toast.warning("Please set the dev extension path in the settings")
		return navigateTo("/set-dev-ext-path")
	}
	const selected = await openFileSelector({
		directory: false,
		multiple: true, // allow install multiple extensions at once
		filters: [
			{
				name: "tarball file",
				extensions: ["tgz", "gz", "kunkun"]
			}
		]
	})
	if (!selected) {
		return ElMessage.warning("No File Selected")
	}
	console.log(selected)
	for (const tarballPath of selected) {
		await installTarball(tarballPath, appConfig.devExtensionPath)
	}
	extStore.load()
}
</script>
<template>
	<pre>{{ appConfig.devExtensionPath }}</pre>
	<div class="flex justify-center gap-3">
		<Button @click="pickExtFolders">Install from Extension Folders</Button>
		<Button @click="pickExtFiles">Install from Extension Tarball File</Button>
	</div>
	<Separator class="my-5 font-mono" label="Drag and Drop" />
	<div flex justify-center>
		<DragNDrop
			@drop="handleDragNDropInstall"
			@drag="dragging = true"
			@drag-cancelled="dragging = false"
		>
			<Card
				:class="cn('h-36 w-96', dragging ? 'border-lime-400/30' : 'text-white hover:text-blue-200')"
			>
				<div class="flex h-full cursor-pointer items-center justify-center">
					<div :class="cn('flex flex-col items-center', dragging ? 'text-lime-400/70' : '')">
						<IconMultiplexer
							:icon="{ value: 'mdi:folder-cog-outline', type: IconEnum.Iconify }"
							class="h-10 w-10"
						/>
						<small class="select-none text-xs">Drag and Drop</small>
					</div>
				</div>
			</Card>
		</DragNDrop>
	</div>
	<Separator class="my-5 font-mono" label="Install Tarball From URL" />
	<AutoForm
		class="space-y-6"
		:schema="formSchema"
		:field-config="{
			url: {
				hideLabel: true
			}
		}"
		@submit="onSubmit"
	>
		<template #url="slotProps">
			<div class="flex items-start gap-3">
				<div class="flex-1">
					<AutoFormField v-bind="slotProps" />
				</div>
				<div>
					<Button type="submit">Add</Button>
				</div>
			</div>
		</template>
	</AutoForm>
</template>
