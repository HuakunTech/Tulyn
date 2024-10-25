<script setup lang="ts">
import { pathExists } from "@kksh/api/commands"
import { Button } from "@kksh/vue/button"
import { Input } from "@kksh/vue/input"
import { open } from "@tauri-apps/plugin-dialog"
import { debug } from "@tauri-apps/plugin-log"
import { useAppConfigStore } from "~/stores/appConfig"
import { useDevExtStore } from "~/stores/extensionLoader"
import { ref } from "vue"
import { toast } from "vue-sonner"

const devExtStore = useDevExtStore()
const appConfig = useAppConfigStore()
const devExtPath = ref(appConfig.devExtensionPath ?? undefined)
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
		// devExtStore.setExtPath(devExtPath.value)
		// await devExtStore.load()
		// toast.success("Dev Extension Path Set", {
		// 	description: `${devExtStore.manifests.length} dev extensions loaded.`
		// })
	} else {
		return toast.error("Invalid Path")
	}
}

function clear() {
	devExtPath.value = undefined
	return appConfig.setDevExtensionPath(devExtPath.value ?? null)
	// .then(() => {
	// 	return toast({
	// 		title: "Cleared"
	// 	})
	// })
	// .catch(() => {
	// 	return toast({
	// 		title: "Failed To Clear",
	// 		variant: "destructive"
	// 	})
	// })
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
