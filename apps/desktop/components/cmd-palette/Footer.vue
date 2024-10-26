<script setup lang="ts">
import Kbd from "@/components/Kbd.vue"
import { DraggableButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppUiStore } from "@/stores/ui"
import { Icon } from "@iconify/vue"
import { Avatar, AvatarFallback, AvatarImage } from "@kksh/vue/avatar"
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
const session = useSupabaseSession()

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

const avatarFallback = computed(() => {
	if (!session.value) return "?"
	const nameSplit = session.value?.user.user_metadata.name.split(" ").filter(Boolean)
	if (nameSplit.length > 1) {
		return nameSplit[0][0] + nameSplit.at(-1)[0]
	} else if (nameSplit.length === 1) {
		return nameSplit[0][0]
	} else {
		return "?"
	}
})

function onAvatarClick() {
	navigateTo("/auth")
}
</script>
<template>
	<div data-tauri-drag-region class="z-50 flex h-12 items-center justify-between border p-2">
		<div flex gap-2 items-center>
			<img
				data-tauri-drag-region
				class="h-6 w-6 invert dark:invert-0"
				src="/img/logo-w-bg.png"
				alt="logo"
			/>
			<button v-if="session" data-tauri-drag-region flex items-center @click="onAvatarClick">
				<Avatar class="-z-10 h-6 w-6 border">
					<AvatarImage :src="session?.user.user_metadata.avatar_url" alt="avatar" />
					<AvatarFallback>{{ avatarFallback }}</AvatarFallback>
				</Avatar>
			</button>
		</div>
		<span class="flex gap-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<DraggableButton variant="ghost" size="icon" @click="onReload">
							<RefreshCcw w-4 data-tauri-drag-region />
						</DraggableButton>
					</TooltipTrigger>
					<TooltipContent>
						<span v-if="_platform === 'macos'">Command + R</span>
						<span v-else>Control + R</span>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DraggableButton v-if="appUiStore.defaultAction" variant="ghost" class="gap-2">
				{{ appUiStore.defaultAction }}
				<Kbd><Icon icon="tdesign:enter" data-tauri-drag-region /></Kbd>
			</DraggableButton>
			<ActionPanel />
		</span>
	</div>
</template>
