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
import * as fs from "@tauri-apps/plugin-fs"
import { onKeyStroke } from "@vueuse/core"
import {
	installDevExtensionDir,
	installFromNpmPackageName,
	installTarball,
	installTarballUrl
} from "~/lib/utils/install"
import { useAppConfigStore } from "~/stores/appConfig"
import { useExtensionStore } from "~/stores/extension"
import { toast } from "vue-sonner"
import { z } from "zod"

const extStore = useExtensionStore()
const appConfig = useAppConfigStore()
const dragging = ref(false)
const urlFormSchema = z.object({
	url: z.string().url()
})

const npmPackageNameFormSchema = z.object({
	name: z.string().min(1)
})

onKeyStroke("Escape", (e) => {
	e.preventDefault()
	navigateTo("/")
})

async function onUrlSubmit(data: z.infer<typeof urlFormSchema>) {
	// data.url
	// https://storage.huakun.tech/vscode-0.0.6.tgz
	if (!appConfig.devExtensionPath) {
		toast.warning("Please set the dev extension path in the settings to install tarball extension")
		return navigateTo("/set-dev-ext-path")
	}
	await installTarballUrl(data.url, appConfig.devExtensionPath)
		.then(() => {
			ElNotification.success({
				title: "Success",
				message: "Extension installed successfully"
			})
		})
		.catch((err) => {
			ElNotification.warning({
				title: "Failed to install extension",
				message: err
			})
		})
}

async function onNpmPackageNameSubmit(data: z.infer<typeof npmPackageNameFormSchema>) {
	// data.name
	if (!appConfig.devExtensionPath) {
		toast.warning("Please set the dev extension path in the settings to install tarball extension")
		return navigateTo("/set-dev-ext-path")
	}
	installFromNpmPackageName(data.name, appConfig.devExtensionPath)
		.then(() => {
			ElNotification.success({
				title: "Success",
				message: "Extension installed successfully"
			})
		})
		.catch((err) => {
			ElNotification.warning({
				title: "Failed to install extension",
				message: err
			})
		})
}

async function handleDragNDropInstall(paths: string[]) {
	dragging.value = false
	console.log(paths)
	for (const path of paths) {
		const stat = await fs.stat(path)
		if (await stat.isDirectory) {
			await installDevExtensionDir(path)
				.then((ext) => {
					ElNotification.success({
						title: "Success",
						message: `Extension from ${ext.extPath} installed successfully`
					})
				})
				.catch((err) => {
					ElNotification.warning({
						title: "Failed to install extension",
						message: err
					})
				})
		} else if (await stat.isFile) {
			if (!appConfig.devExtensionPath) {
				toast.warning(
					"Please set the dev extension path in the settings to install tarball extension"
				)
				continue
			}
			await installTarball(path, appConfig.devExtensionPath)
				.then((ext) => {
					ElNotification.success({
						title: "Success",
						message: `Extension from ${path} installed successfully`
					})
				})
				.catch((err) => {
					ElNotification.warning({
						title: "Failed to install extension",
						message: err
					})
				})
		} else {
			toast.warning(`Unsupported file type: ${path}`)
		}
		// await installDevExtensionDir(path)
	}
	extStore.load()
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
			.then((ext) => {
				ElNotification.success({
					title: "Success",
					message: `Extension from ${ext.extPath} installed successfully`
				})
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
	<!-- <pre>{{ appConfig.devExtensionPath }}</pre> -->
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
						<small class="select-none font-mono text-xs">Drag and Drop</small>
						<small class="select-none font-mono text-xs">Extension Folder or Tarball</small>
					</div>
				</div>
			</Card>
		</DragNDrop>
	</div>
	<Separator class="my-5 font-mono" label="Install Tarball From URL" />
	<div flex flex-col gap-3>
		<AutoForm
			class="space-y-6"
			:schema="urlFormSchema"
			:field-config="{
				url: {
					hideLabel: true,
					inputProps: {
						placeholder: 'Tarball URL'
					}
				}
			}"
			@submit="onUrlSubmit"
		>
			<template #url="slotProps">
				<div class="flex items-start gap-3">
					<div class="flex-1">
						<AutoFormField v-bind="slotProps" />
					</div>
					<div>
						<Button type="submit">Install</Button>
					</div>
				</div>
			</template>
		</AutoForm>
		<AutoForm
			:schema="npmPackageNameFormSchema"
			:field-config="{
				name: {
					hideLabel: true,
					inputProps: {
						placeholder: 'NPM Package Name'
					}
				}
			}"
			@submit="onNpmPackageNameSubmit"
		>
			<template #name="slotProps">
				<div class="flex items-start gap-3">
					<div class="flex-1">
						<AutoFormField v-bind="slotProps" />
					</div>
					<div>
						<Button type="submit">Install</Button>
					</div>
				</div>
			</template>
		</AutoForm>
	</div>
</template>
