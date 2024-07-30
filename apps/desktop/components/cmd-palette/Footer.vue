<script setup lang="ts">
import Kbd from "@/components/Kbd.vue"
import { cn } from "@/lib/utils"
import { useAppUiStore } from "@/stores/ui"
import { Icon } from "@iconify/vue"
import { Button } from "@kkui/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@kkui/components/ui/tooltip"
import { platform } from "@tauri-apps/plugin-os"
import { RefreshCcw } from "lucide-vue-next"
import ActionPanel from "./ActionPanel.vue"

const _platform = platform()
const appUiStore = useAppUiStore()
function onReload() {
	location.reload()
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
		<img :class="cn('h-6 w-6', 'invert dark:invert-0')" src="/img/logo-w-bg.png" alt="logo" />
		<span class="flex gap-2">
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
			<Button v-if="appUiStore.defaultAction" variant="ghost" class="gap-2">
				{{ appUiStore.defaultAction }}
				<Kbd><Icon icon="tdesign:enter" /></Kbd>
			</Button>
			<ActionPanel />
		</span>
	</div>
</template>
