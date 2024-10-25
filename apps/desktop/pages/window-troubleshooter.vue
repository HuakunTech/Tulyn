<script setup lang="ts">
import { getExtLabelMap, unregisterExtensionWindow } from "@kksh/api/commands"
import type { ExtensionLabelMap } from "@kksh/api/models"
import { Button } from "@kksh/vue/button"
import { Checkbox } from "@kksh/vue/checkbox"
import { ScrollArea, ScrollBar } from "@kksh/vue/scroll-area"
import { ArrowLeftIcon, TrashIcon } from "@radix-icons/vue"
import { getAllWebviewWindows, getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { onKeyStroke } from "@vueuse/core"
import { toast } from "vue-sonner"

const appWin = getCurrentWebviewWindow()
const winLabelMap = ref<ExtensionLabelMap>({})
const refreshEverySecond = ref(false)
const refreshCount = ref(0)

onKeyStroke("Escape", (e) => {
	e.preventDefault()
	onBack()
})

function onBack() {
	if (appWin.label === "main") {
		navigateTo("/")
	} else {
		appWin.close()
	}
}

async function refresh() {
	const extLabelMap = await getExtLabelMap()
	winLabelMap.value = extLabelMap
	refreshCount.value++
}

function refreshWinLabelMapRecursively() {
	setTimeout(async () => {
		await refresh()
		if (refreshEverySecond.value) {
			refreshWinLabelMapRecursively()
		}
	}, 1000)
}

onMounted(async () => {
	const extLabelMap = await getExtLabelMap()
	winLabelMap.value = extLabelMap
	refreshCount.value = 1
})

watch(refreshEverySecond, (checked) => {
	if (checked) {
		refreshWinLabelMapRecursively()
	}
})

function unregisterWindow(label: string) {
	unregisterExtensionWindow(label)
		.then(() => {
			toast.success("Unregistered window")
		})
		.catch((err) => {
			toast.error({
				title: "Failed to unregister window",
				description: err.message
			})
		})
}
</script>
<template>
	<main class="container h-screen w-screen pt-10">
		<Button variant="outline" size="icon" class="absolute left-2 top-2 z-50" @click="onBack">
			<ArrowLeftIcon />
		</Button>
		<div class="flex items-center justify-between space-x-2">
			<div flex items-center space-x-2>
				<Checkbox id="refreshEverySecond" v-model:checked="refreshEverySecond" />
				<label
					for="refreshEverySecond"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Refresh Every Second
				</label>
			</div>
			<span flex items-center space-x-2>
				<Button size="sm" @click="refresh">Refresh</Button>
				<span>Refreshed {{ refreshCount }} times</span>
			</span>
		</div>
		<ScrollArea py-5>
			<ul flex flex-col gap-5>
				<li v-for="[label, content] in Object.entries(winLabelMap)" :key="label">
					<span flex gap-2
						><strong>Label:</strong>
						<pre text-lime>{{ label }}</pre>
					</span>
					<!-- <pre>{{ content }}</pre> -->
					<ul pl-5>
						<li v-for="[key, value] in Object.entries(content)" :key="key">
							<span flex gap-2>
								<strong>{{ key }}:</strong>
								<pre text-lime>{{ value }}</pre>
							</span>
						</li>
					</ul>
					<Button variant="destructive" size="icon" @click="unregisterWindow(label)">
						<TrashIcon />
					</Button>
				</li>
			</ul>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	</main>
</template>
