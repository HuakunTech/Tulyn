<script setup lang="ts">
import StrikeSeparator from "@/components/StrikeSeparator.vue"
import { type Remote } from "@huakunshen/comlink"
import { ListSchema, WorkerExtension } from "@kksh/api/ui/worker"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@kksh/vue/resizable"
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from "~/components/ui/command"
import type { HTMLAttributes } from "vue"
import ListDetail from "./ListDetail.vue"
import ListItem from "./ListItem.vue"

const props = defineProps<{
	modelValue: ListSchema.List
	workerAPI: Remote<WorkerExtension>
	loading: boolean
	class: HTMLAttributes["class"]
}>()
let isScrolling = false
let defaultDetailWidth = props.modelValue.detail ? props.modelValue.detail?.width ?? 70 : 0
function onScroll(e: Event) {
	const element = e.target as HTMLElement
	if (!isScrolling && element?.scrollHeight - element?.scrollTop === element?.clientHeight) {
		isScrolling = true
		props.workerAPI.onScrolledToBottom()
		setTimeout(() => {
			isScrolling = false
		}, 500)
	}
}
</script>
<template>
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
</template>
