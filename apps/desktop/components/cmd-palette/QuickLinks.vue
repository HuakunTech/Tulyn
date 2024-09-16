<script lang="ts" setup>
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "vue"

const quickLinkInputs = defineModel<QuickLinkQuery[]>("quickLinkInputs")

const props = defineProps<{
	searchTerm: string
	class?: HTMLAttributes["class"]
}>()

function queryWidth(quickLink: QuickLinkQuery) {
	if (quickLink.value.length > quickLink.name.length) {
		return quickLink.value.length + 2
	} else {
		return quickLink.name.length + 2
	}
}
</script>

<template>
	<span
		:class="cn('absolute flex space-x-2', props.class)"
		:style="{ left: searchTerm.length + 3 + 'ch' }"
	>
		<input
			v-for="(quickLink, idx) in quickLinkInputs"
			:key="idx"
			class="bg-muted rounded-md border border-gray-300 pl-2 font-mono focus:outline-none dark:border-gray-600"
			type="text"
			:placeholder="quickLink.name"
			:style="{
				width: queryWidth(quickLink) + 'ch'
			}"
			v-model="quickLinkInputs![idx].value"
		/>
	</span>
</template>
