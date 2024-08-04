<script setup lang="ts">
import CmdInput from "@/components/cmd-palette/CommandInput.vue"
import StrikeSeparator from "@/components/StrikeSeparator.vue"
import { HTMLElementId } from "@/lib/constants"
import { type Remote } from "@huakunshen/comlink"
import { ListSchema, WorkerExtension } from "@kksh/api/ui/worker"
import { Button } from "@kksh/vue/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@kksh/vue/resizable"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { debug } from "@tauri-apps/plugin-log"
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from "~/components/ui/command"
import type { ComboboxInput } from "radix-vue"
import type { HTMLAttributes } from "vue"
import ListDetail from "./ListDetail.vue"
import ListItem from "./ListItem.vue"

const localePath = useLocalePath()
const appUiStore = useAppUiStore()
const cmdInputRef = ref<InstanceType<typeof ComboboxInput> | null>(null)
const searchTerm = defineModel<string>("searchTerm", { required: true })
const searchBarPlaceholder = defineModel<string>("searchBarPlaceholder", { required: true })

useListenToWindowFocus(() => {
	getWorkerExtInputEle()?.focus()
})

const props = defineProps<{
	modelValue: ListSchema.List
	workerAPI: Remote<WorkerExtension>
	loading: boolean
	class?: HTMLAttributes["class"]
}>()

let isScrolling = false
let defaultDetailWidth = props.modelValue.detail ? props.modelValue.detail?.width ?? 70 : 0

function getWorkerExtInputEle(): HTMLInputElement | null {
	return cmdInputRef.value?.$el.querySelector("input")
}

function onActionSelected() {
	getWorkerExtInputEle()?.focus() // Focus back to worker extension search input box
}

defineExpose({
	onActionSelected
})

onKeyStroke("Escape", () => {
	if (document.activeElement === getWorkerExtInputEle()) {
		if (searchTerm.value.length > 0) {
			searchTerm.value = ""
			return
		} else {
			return navigateTo(localePath("/"))
		}
	} else {
		getWorkerExtInputEle()?.focus()
	}
})

function onScroll(e: Event) {
	const element = e.target as HTMLElement
	if (!isScrolling && element?.scrollHeight - element?.scrollTop === element?.clientHeight) {
		isScrolling = true
		props.workerAPI.onListScrolledToBottom()
		setTimeout(() => {
			isScrolling = false
		}, 500)
	}
}

function onEnterKeyPressed() {
	if (props.workerAPI) {
		debug("Enter key pressed")
		props.workerAPI.onEnterPressedOnSearchBar()
	}
}

function onSearchTermChange(searchTerm: string) {
	props.workerAPI?.onSearchTermChange(searchTerm)
}

function filterFunction(items: ListSchema.Item[], searchTerm: string) {
	return items.filter((item) => {
		if (item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
			return true
		}
		for (const keyword of item?.keywords ?? []) {
			if (keyword.toLowerCase().includes(searchTerm.toLowerCase())) {
				return true
			}
		}
		return false
	})
}

function onHighlightedItemChanged(itemValue: string) {
	props.workerAPI?.onHighlightedListItemChanged(itemValue)
	const item = props.modelValue.items?.find((item) => item.value === itemValue)
	appUiStore.setActionPanel(item?.actions)
	appUiStore.setDefaultAction(item?.defaultAction)
}

/* ------ Preserve highlighted item when mouse moves away from the list ----- */
const highlightedItemValue = ref<ListSchema.Item | undefined>()
watch(highlightedItemValue, (newVal, oldVal) => {
	if (!newVal && oldVal) {
		setTimeout(() => {
			highlightedItemValue.value = oldVal
		}, 1)
	}
	if (newVal) {
		onHighlightedItemChanged(newVal.value)
	}
})
</script>
<template>
	<Command
		class=""
		:id="HTMLElementId.WorkerExtInputId"
		v-model:searchTerm="searchTerm"
		@update:search-term="onSearchTermChange"
		@update:model-value="(v) => workerAPI?.onListItemSelected((v as ListSchema.Item).value)"
		v-model:selected-value="highlightedItemValue"
		:identity-filter="false"
		:filterFunction="(items, term) => filterFunction(items as ListSchema.Item[], term)"
	>
		<CmdInput
			ref="cmdInputRef"
			class="text-md h-12"
			:placeholder="searchBarPlaceholder ?? 'Search...'"
			@keydown.enter="onEnterKeyPressed"
		>
			<Button size="icon" variant="outline" @click="() => navigateTo('/')">
				<ArrowLeftIcon />
			</Button>
		</CmdInput>
		<ResizablePanelGroup direction="horizontal" :class="props.class">
			<ResizablePanel :default-size="100 - defaultDetailWidth">
				<CommandList class="h-full" @scroll="onScroll">
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup v-for="section in modelValue.sections" :heading="section.title">
						<ListItem v-for="item in section.items" :item="item" />
					</CommandGroup>
					<ListItem v-for="item in modelValue.items" :item="item" />
					<StrikeSeparator v-if="loading" class="h-20"><span>Loading</span></StrikeSeparator>
				</CommandList>
			</ResizablePanel>
			<ResizableHandle with-handle />
			<ResizablePanel :default-size="defaultDetailWidth">
				<ListDetail v-if="modelValue.detail" :detail="modelValue.detail" />
			</ResizablePanel>
		</ResizablePanelGroup>
		<CmdPaletteFooter />
	</Command>
</template>
