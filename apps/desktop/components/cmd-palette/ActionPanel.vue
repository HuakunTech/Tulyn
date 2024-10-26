<script setup lang="ts">
import Kbd from "@/components/Kbd.vue"
import { DraggableButton } from "@/components/ui/button"
import { HTMLElementId } from "@/lib/constants"
import { useAppUiStore } from "@/stores/ui"
import { Icon } from "@iconify/vue"
import { Button } from "@kksh/vue/button"
import { Popover, PopoverContent, PopoverTrigger } from "@kksh/vue/popover"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from "~/components/ui/command"
import { GlobalEventBus } from "~/lib/utils/events"
import { ref } from "vue"

const appUiStore = useAppUiStore()
const { meta, k, escape } = useMagicKeys()
const open = ref(false)
const cmdk = computed(() => meta.value && k.value)
watch(cmdk, (val) => {
	if (val) {
		open.value = true
	}
})
watch(escape, (val) => {
	if (val) {
		open.value = false
	}
})
function onActionSelected(val: string) {
	GlobalEventBus.emitActionSelected(val)
	open.value = false
}
</script>

<template>
	<Popover v-model:open="open">
		<PopoverTrigger>
			<DraggableButton
				variant="ghost"
				role="combobox"
				:aria-expanded="open"
				class="justify-between gap-2"
			>
				Action
				<span class="flex items-center gap-0.5" data-tauri-drag-region>
					<Kbd data-tauri-drag-region><Icon data-tauri-drag-region icon="ph-command" class="h-4 w-4 shrink-0" /></Kbd>
					<Kbd data-tauri-drag-region>K</Kbd>
				</span>
			</DraggableButton>
		</PopoverTrigger>
		<PopoverContent class="w-[200px] p-0">
			<Command @update:model-value="(v) => onActionSelected(v as string)">
				<CommandInput
					class="h-9"
					placeholder="Pick Action..."
					:id="HTMLElementId.ActionPanelInputId"
				/>
				<CommandEmpty>No action found.</CommandEmpty>
				<CommandList>
					<CommandItem
						v-if="appUiStore.actionPanel"
						v-for="action in appUiStore.actionPanel?.items"
						:value="action.value"
						class="gap-2"
					>
						<IconMultiplexer v-if="action.icon" :icon="action.icon" />
						<span>{{ action.title }}</span>
					</CommandItem>
				</CommandList>
			</Command>
		</PopoverContent>
	</Popover>
</template>
