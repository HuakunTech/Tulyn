<script setup lang="ts">
import {
	List,
	ListSchema,
	MarkdownSchema,
	NodeNameEnum,
	WorkerExtension
} from "@kksh/api/ui/worker"
import Markdown from "./Markdown.vue"

const props = defineProps<{
	detail: ListSchema.ItemDetail
}>()
</script>

<template>
	<div v-for="child in detail.children">
		<Markdown
			v-if="child.nodeName === NodeNameEnum.Markdown"
			:markdown="(child as MarkdownSchema).content"
		/>
	</div>
</template>
