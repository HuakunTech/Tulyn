<script setup lang="ts">
import CmdInput from "@/components/cmd-palette/CommandInput.vue"
import StrikeSeparator from "@/components/StrikeSeparator.vue"
import { HTMLElementId } from "@/lib/constants"
import { type Remote } from "@huakunshen/comlink"
import { ListSchema, WorkerExtension } from "@kksh/api/ui/worker"
import { Button } from "@kksh/vue/button"
import { Progress } from "@kksh/vue/progress"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@kksh/vue/resizable"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { debug } from "@tauri-apps/plugin-log"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList
} from "~/components/ui/command"
import type { ComboboxInput } from "radix-vue"
import type { HTMLAttributes } from "vue"
import ListDetail from "./ListDetail.vue"
import ListItem from "./ListItem.vue"

const panelRef1 = ref<InstanceType<typeof ResizablePanel>>()
const panelRef2 = ref<InstanceType<typeof ResizablePanel>>()
const localePath = useLocalePath()
const appUiStore = useAppUiStore()
const cmdInputRef = ref<InstanceType<typeof ComboboxInput> | null>(null)
const searchTerm = defineModel<string>("searchTerm", { required: true })
const searchBarPlaceholder = defineModel<string>("searchBarPlaceholder", { required: true })
const appWin = getCurrentWebviewWindow()

useListenToWindowFocus(() => {
	getWorkerExtInputEle()?.focus()
})

const props = defineProps<{
	modelValue: ListSchema.List
	workerAPI: Remote<WorkerExtension>
	loading: boolean
	pbar: number | null
	class?: HTMLAttributes["class"]
}>()

watch(
	() => props.modelValue.detail?.width,
	(newVal) => {
		if (newVal) {
			panelRef2.value?.resize(newVal)
		}
	}
)

let isScrolling = false
const defaultDetailWidth = ref(props.modelValue.detail ? (props.modelValue.detail?.width ?? 70) : 0)

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
			return goBack()
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
	if (props.modelValue.filter === "none") {
		return items
	}
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
	// if an action or defaultAction is set in List directly, the item's action or defaultAction will be overridden
	if (props.modelValue.actions) {
		appUiStore.setActionPanel(props.modelValue.actions)
	} else {
		appUiStore.setActionPanel(item?.actions)
	}
	if (props.modelValue.defaultAction) {
		appUiStore.setDefaultAction(props.modelValue.defaultAction)
	} else {
		appUiStore.setDefaultAction(item?.defaultAction)
	}
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

function goBack() {
	props.workerAPI.onBeforeGoBack()
	if (appWin.label !== "main") {
		return appWin.close()
	} else {
		return navigateTo(localePath("/"))
	}
}
</script>
<template>
	<Command
		class=""
		:id="HTMLElementId.WorkerExtInputId"
		v-model:searchTerm="searchTerm"
		@update:search-term="onSearchTermChange"
		@update:model-value="(v) => props.workerAPI?.onListItemSelected((v as ListSchema.Item).value)"
		v-model:selected-value="highlightedItemValue"
		:filterFunction="(items, term) => filterFunction(items as ListSchema.Item[], term)"
	>
		<CmdInput
			ref="cmdInputRef"
			:search-term="searchTerm"
			class="text-md h-12"
			:placeholder="searchBarPlaceholder ?? 'Search...'"
			@keydown.enter="onEnterKeyPressed"
		>
			<Button size="icon" variant="outline" @click="goBack">
				<ArrowLeftIcon />
			</Button>
		</CmdInput>
		<Progress v-if="pbar" :model-value="pbar" class="h-[1.5px] rounded-none" />
		<ResizablePanelGroup direction="horizontal" :class="props.class">
			<ResizablePanel :default-size="100 - defaultDetailWidth" ref="panelRef1">
				<CommandList class="h-full" @scroll="onScroll">
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup v-for="section in props.modelValue.sections" :heading="section.title">
						<ListItem v-for="item in section.items" :item="item" />
					</CommandGroup>
					<ListItem v-for="item in props.modelValue.items" :item="item" />
					<StrikeSeparator v-if="props.loading" class="h-20"><span>Loading</span></StrikeSeparator>
				</CommandList>
			</ResizablePanel>
			<ResizableHandle with-handle />
			<ResizablePanel :default-size="defaultDetailWidth" ref="panelRef2">
				<ListDetail v-if="props.modelValue.detail" :detail="props.modelValue.detail" />
			</ResizablePanel>
		</ResizablePanelGroup>
		<CmdPaletteFooter />
	</Command>
</template>
