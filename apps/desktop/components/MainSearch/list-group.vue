<script setup lang="ts">
import ListItem from "@/components/MainSearch/list-item.vue"
import { CommandGroup, CommandItem } from "@/components/ui/command"
import type { IExtensionBase } from "@/lib/extension/base"
import { $appState } from "@/lib/stores/appState"
import type { TListItem } from "@/lib/types/list"
import { useStore } from "@nanostores/vue"
import { computed } from "vue"

const appState = useStore($appState)
const props = defineProps<{ ext: IExtensionBase }>()
const listItems = useStore(props.ext.$listItems)

const showListItems = computed(() => {
	if (!appState.value.searchTerm || appState.value.searchTerm.length < 2)
		return listItems.value?.slice(0, 10)
	return listItems.value.filter((item) => {
		const titleMatch = item.title.toLowerCase().includes(appState.value.searchTerm.toLowerCase())
		const keywordMatch = item.keywords
			.map((keyword) => keyword.toLowerCase().includes(appState.value.searchTerm.toLowerCase()))
			.some((x) => x)
		return titleMatch || keywordMatch
	})
})
</script>
<template>
	<div>
		<CommandGroup :heading="ext.extensionName">
			<ListItem
				v-for="(item, idx) in showListItems"
				:item="item as TListItem"
				:isDevExt="ext.extensionName === 'Dev Extensions'"
				:key="`${ext.extensionName}-${item.title}-${item.value}`"
				@select="ext.onSelect(item as TListItem)"
			/>
		</CommandGroup>
	</div>
</template>
