<script setup lang="ts">
import PermissionInspector from "@/components/extension-store/permission-inspector.vue"
import type { ExtPackageJsonExtra } from "@kksh/api/models"
import { Button } from "@kksh/vue/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@kksh/vue/card"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { join } from "@tauri-apps/api/path"
import { open as openDialog } from "@tauri-apps/plugin-dialog"
import { exists } from "@tauri-apps/plugin-fs"
import { loadExtensionManifestFromDisk } from "~/lib/commands/extensions"

const pkgJson = ref<ExtPackageJsonExtra>()

function onBack() {
	navigateTo("/")
}

onKeyStroke("Escape", (e) => {
	e.preventDefault()
	onBack()
})

async function onPick() {
	const path = await openDialog({
		directory: true
	})
	if (!path) {
		return ElNotification.error("No folder selected")
	}
	if (!(await exists(path))) {
		return ElNotification.error("Selected path does not exist")
	}
	const manifestPath = await join(path, "package.json")
	if (!(await exists(manifestPath))) {
		return ElNotification.error("Selected path is not an extension")
	}
	loadExtensionManifestFromDisk(manifestPath)
		.then((m) => {
			pkgJson.value = m
			ElNotification.success("Extension manifest loaded")
		})
		.catch((err) => {
			ElNotification.error(`Failed to load extension manifest: ${err}`)
		})
}
</script>
<template>
	<main class="container h-screen w-screen pt-10">
		<Button variant="outline" size="icon" class="absolute left-2 top-2 z-50" @click="onBack">
			<ArrowLeftIcon />
		</Button>
		<h1 class="text-2xl font-bold">Extension Permission Inspector</h1>
		<br />
		<Button @click="onPick">Pick Extension Folder to Inspect</Button>
		<br />
		<br />
		<div v-if="pkgJson">
			<Card>
				<CardContent>
					<PermissionInspector :manifest="pkgJson.kunkun" />
				</CardContent>
				<CardFooter class="block">
					<p>
						<strong>Identifier:</strong> <code>{{ pkgJson.kunkun.identifier }}</code>
					</p>
					<p>
						<strong>Extension Path:</strong> <code>{{ pkgJson.extPath }}</code>
					</p>
				</CardFooter>
			</Card>
		</div>
	</main>
</template>
