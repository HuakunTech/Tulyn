<script setup lang="ts">
import {
	getDevExtensionFolder,
	getExtensionFolder,
	getServerPort,
	restartServer,
	serverIsRunning,
	startServer,
	stopServer
} from "@kksh/api/commands"
import { Badge, Button } from "@kksh/vue"
import { open } from "tauri-plugin-shellx-api"
import { onMounted, onUnmounted, ref } from "vue"
import { toast } from "vue-sonner"
import { z } from "zod"

const serverRunning = ref(false)
let interval: NodeJS.Timeout
const extFolder = ref<string | null>()
const devExtFolder = ref<string | null>()
const port = ref<number>()

async function refreshStatus() {
	serverRunning.value = z.boolean().parse(await serverIsRunning())
	extFolder.value = await getExtensionFolder()
	devExtFolder.value = await getDevExtensionFolder()
	port.value = await getServerPort()
}

onMounted(async () => {
	refreshStatus()
	interval = setInterval(async () => {
		refreshStatus()
	}, 1000)
})

onUnmounted(() => {
	clearInterval(interval)
})

function start() {
	startServer()
		.then(() => {
			toast.info("Start Server Command Sent")
		})
		.catch((err) => {
			toast.error("Start Server Error", err)
		})
}

function stop() {
	stopServer()
		.then(() => {
			toast.info("Stop Server Command Sent")
		})
		.catch((err) => {
			toast.error("Stop Server Error", err)
		})
}

function restart() {
	restartServer()
		.then(() => {
			toast({
				title: "Restart Server Command Sent"
			})
		})
		.catch((err) => {
			toast({
				title: "Restart Server Error",
				description: err,
				variant: "destructive"
			})
		})
}
</script>
<template>
	<div class="flex items-center justify-between">
		<div class="flex space-x-2">
			<Button size="xs" @click="start">Start Server</Button>
			<Button size="xs" @click="stop">Stop Server</Button>
			<Button size="xs" @click="restart">Restart Server</Button>
		</div>
		<span class="pr-5">
			<Badge
				v-if="serverRunning"
				variant="secondary"
				class="cursor-default select-none bg-green-700 text-white"
				>On</Badge
			>
			<Badge v-else variant="destructive" class="cursor-default select-none">Off</Badge>
		</span>
	</div>
	<div class="my-2">
		<p>
			<strong>Port: </strong>
			<span>{{ port }}</span>
		</p>
		<p>
			<strong>Extension Folder: </strong>
			<span class="text-muted-foreground cursor-pointer" @click="extFolder && open(extFolder)">{{
				extFolder
			}}</span>
		</p>
		<p>
			<strong>Dev Extension Folder: </strong>
			<span
				class="text-muted-foreground cursor-pointer"
				@click="devExtFolder && open(devExtFolder)"
			>
				{{ devExtFolder }}
			</span>
		</p>
	</div>
</template>
