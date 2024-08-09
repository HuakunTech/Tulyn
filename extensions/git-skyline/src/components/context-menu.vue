<script setup lang="ts">
import { cn } from "@/lib/utils"
import { ui } from "@kksh/api/ui/iframe"
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from "@kksh/vue/context-menu"
import { HTMLAttributes } from "vue"

const displayPreference = defineModel<boolean>("displayPreference", { required: true })
const props = defineProps<{ class?: HTMLAttributes["class"]; showInstructions: boolean }>()
function selectSetting() {
	displayPreference.value = true
}

function close() {
	ui.goBack()
}
</script>

<template>
	<ContextMenu :class="cn(props.class, '')" data-tauri-drag-region>
		<ContextMenuTrigger class="h-full w-full">
			<div :class="cn('h-full w-full', showInstructions ? 'border border-green-400' : '')">
				<div
					v-if="showInstructions"
					class="flex h-full w-full flex-col items-center justify-center"
				>
					<h1 class="z-0 select-none text-3xl">Right Click on This Region to Go To Settings</h1>
					<h1 class="z-0 select-none text-3xl">Press Escape To Close Window</h1>
				</div>
			</div>
		</ContextMenuTrigger>
		<ContextMenuContent>
			<ContextMenuItem @select="selectSetting"> Setting </ContextMenuItem>
			<ContextMenuItem @select="close"> Close </ContextMenuItem>
		</ContextMenuContent>
	</ContextMenu>
</template>
