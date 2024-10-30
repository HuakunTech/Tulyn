<script setup lang="ts">
import { DraggableButton } from "@/components/ui/button"
import { openDevTools, toggleDevTools } from "@kksh/api/commands"
// import { Button } from "@kksh/vue/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger
} from "@kksh/vue/dropdown-menu"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { toggleDevExtensionLiveLoadMode } from "~/utils/commands"
import { CircleXIcon, EllipsisVerticalIcon, PinIcon, RefreshCcwIcon } from "lucide-vue-next"

const appConfig = useAppConfigStore()

function onClose() {
	const win = getCurrentWebviewWindow()
	win.hide()
	// win.close()
}

function reloadWindow() {
	window.location.reload()
}

const keys = useMagicKeys()
const controlShiftI = keys["Shift+Ctrl+I"]
const controlShiftR = keys["Shift+Ctrl+R"]

watch(controlShiftI, (v) => {
	if (v) {
		toggleDevTools()
	}
})

watch(controlShiftR, (v) => {
	if (v) {
		reloadWindow()
	}
})
</script>
<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<DraggableButton size="icon" variant="outline">
				<EllipsisVerticalIcon data-tauri-drag-region class="h-4 w-4" />
			</DraggableButton>
		</DropdownMenuTrigger>
		<DropdownMenuContent class="w-96">
			<DropdownMenuItem @click="onClose" class="" value="top">
				<CircleXIcon class="mr-2 h-4 w-4" />
				<span>Close Window</span>
			</DropdownMenuItem>

			<DropdownMenuItem @click="onClose" class="" value="top">
				<CircleXIcon class="mr-2 h-4 w-4" />
				<span>Quit App</span>
			</DropdownMenuItem>

			<DropdownMenuSeparator />
			<DropdownMenuLabel>Developer</DropdownMenuLabel>
			<DropdownMenuItem @click="toggleDevTools" class="" value="top">
				<Icon name="lineicons:dev" class="mr-2 h-4 w-4 text-green-500" />
				<span>Toggle DevTools</span>
				<DropdownMenuShortcut>⌃+Shift+I</DropdownMenuShortcut>
			</DropdownMenuItem>
			<DropdownMenuItem @click="reloadWindow" class="" value="top">
				<RefreshCcwIcon class="mr-2 h-4 w-4 text-green-500" />
				<span>Reload Window</span>
				<DropdownMenuShortcut>⌃+Shift+R</DropdownMenuShortcut>
			</DropdownMenuItem>
			<DropdownMenuItem @click="toggleDevExtensionLiveLoadMode" class="" value="top">
				<Icon
					v-if="appConfig.devExtLoadUrl"
					name="fontisto:toggle-on"
					class="mr-1 h-5 w-5 text-green-500"
				/>
				<Icon v-else name="fontisto:toggle-off" class="mr-1 h-5 w-5 text-green-500" />
				<span>Toggle Dev Extension Live Load Mode</span>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
