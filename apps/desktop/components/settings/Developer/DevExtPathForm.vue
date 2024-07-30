<script setup lang="ts">
import { Extension } from "@/lib/extension/ext"
import { pathExists } from "@kksh/api/commands"
import { Button } from "@kkui/components/ui/button"
import { Input } from "@kkui/components/ui/input"
// import { loadDevExtManifests, loadExtManifests, $extensionsStore } from "@/lib/stores/extensions";
import { open } from "@tauri-apps/plugin-dialog"
import { exists } from "@tauri-apps/plugin-fs"
import { debug } from "@tauri-apps/plugin-log"
import { emitRefreshConfig, emitRefreshExt } from "~/lib/utils/tauri-events"
import { useAppConfigStore } from "~/stores/appConfig"
import { onMount } from "nanostores"
import { onMounted, ref } from "vue"
import { toast } from "vue-sonner"

const appConfig = useAppConfigStore()
const devExt = new Extension("Dev Extensions", appConfig.devExtensionPath, true)
const devExtPath = ref(appConfig.devExtensionPath)
const lock = ref(true)

async function pickDirectory() {
	const dir = await open({
		multiple: false,
		directory: true
	})
	debug(`dir: ${dir}`)
	if (dir && (await pathExists(dir))) {
		devExtPath.value = dir
		appConfig.setDevExtensionPath(dir)
		devExt.extPath = devExtPath.value
		await devExt.load()
		toast.success("Dev Extension Path Set", {
			description: `${devExt.manifests.length} dev extensions loaded.`
		})
	} else {
		return toast.error("Invalid Path")
	}
}

function clear() {
	devExtPath.value = undefined
	return appConfig
		.setDevExtensionPath(devExtPath.value)
		.then(() => {
			return toast({
				title: "Cleared"
			})
		})
		.catch(() => {
			return toast({
				title: "Failed To Clear",
				variant: "destructive"
			})
		})
}
</script>

<template>
	<div class="flex w-full items-center gap-1.5">
		<Input
			id="dev-ext-path"
			type="path"
			placeholder="Enter Path"
			v-model="devExtPath"
			:disabled="lock"
		/>
		<Button size="sm" type="button" @click="clear">
			Clear
			<Icon name="material-symbols:delete-outline" class="ml-1 h-5 w-5" />
		</Button>
		<Button size="sm" type="button" @click="pickDirectory">
			Edit
			<Icon name="flowbite:edit-outline" class="ml-1 h-5 w-5" />
		</Button>
	</div>
</template>
