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
import { EllipsisVerticalIcon, PinIcon } from "lucide-vue-next"

const position = ref("bottom")
function onChange() {
	console.log("Changed")
}

function onPin() {
	// const win = getCurrentWebviewWindow()
	// win.set
	console.log("Pinned")
}
</script>
<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<!-- <Button variant="outline"> Open </Button> -->
			<Button size="icon" variant="ghost">
				<EllipsisVerticalIcon class="h-4 w-4" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent class="w-20">
			<!-- <DropdownMenuItem @click="onPin" class="space-x-2" value="top">
				<PinIcon class="h-4 w-4" />
				<span>Pin</span>
			</DropdownMenuItem> -->
		</DropdownMenuContent>
	</DropdownMenu>
</template>
