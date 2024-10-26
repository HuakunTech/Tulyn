<script setup lang="ts">
import { Button } from "@kksh/vue/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioItem,
	DropdownMenuTrigger
} from "@kksh/vue/dropdown-menu"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { CircleXIcon, EllipsisVerticalIcon, PinIcon } from "lucide-vue-next"

const position = ref("bottom")
function onChange() {
	console.log("Changed")
}

function onClose() {
	const win = getCurrentWebviewWindow()
	win.close()
	// win.set
	// console.log("Pinned")
}
</script>
<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button size="icon" variant="outline">
				<EllipsisVerticalIcon class="h-4 w-4" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent class="w-52">
			<DropdownMenuItem @click="onClose" class="space-x-2" value="top">
				<CircleXIcon class="h-4 w-4" />
				<span>Close Window</span>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
