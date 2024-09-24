<script setup lang="ts">
import Kbd from "@/components/Kbd.vue"
import { cn } from "@/lib/utils"
import { useAppUiStore } from "@/stores/ui"
import { Icon } from "@iconify/vue"
import { Button } from "@kksh/vue/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kksh/vue/tooltip"
import { platform } from "@tauri-apps/plugin-os"
import { initStores } from "~/lib/utils/stores"
import { RefreshCcw } from "lucide-vue-next"
import { toast } from "vue-sonner"
import ActionPanel from "./ActionPanel.vue"

const _platform = platform()
const appUiStore = useAppUiStore()
const appConfig = useAppConfigStore()

function onReload() {
	appConfig.init()
	initStores()
		.then(() => {
			toast.success("Reloaded configurations and data")
		})
		.catch((err) => {
			toast.error("Failed to reload configurations and data")
		})
	// location.reload()
}

function onKeyDown(e: KeyboardEvent) {
	if (e.key === "r" && (e.ctrlKey || e.metaKey)) {
		onReload()
	}
}

onMounted(() => {
	document.addEventListener("keydown", onKeyDown)
})

onUnmounted(() => {
	document.removeEventListener("keydown", onKeyDown)
})
</script>
<template>
	<div data-tauri-drag-region class="z-50 flex h-12 items-center justify-between border p-2">
		<img class="h-6 w-6 invert dark:invert-0" src="/img/logo-w-bg.png" alt="logo" />
		<span class="flex gap-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button variant="ghost" size="icon" @click="onReload">
							<RefreshCcw class="w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<span v-if="_platform === 'macos'">Command + R</span>
						<span v-else>Control + R</span>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<Button v-if="appUiStore.defaultAction" variant="ghost" class="gap-2">
				{{ appUiStore.defaultAction }}
				<Kbd><Icon icon="tdesign:enter" /></Kbd>
			</Button>
			<ActionPanel />
		</span>
	</div>
</template>
