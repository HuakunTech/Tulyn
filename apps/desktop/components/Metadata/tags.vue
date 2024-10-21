<script setup lang="ts">
import type { ListSchema } from "@kksh/api/ui/worker"
import Tag, { type Tag as TagType } from "./tag.vue"

const props = defineProps<{
	tags: TagType[]
	title: string
}>()
</script>
<template>
	<div class="flex justify-between gap-1 py-1">
		<span class="text-muted-foreground text-sm font-semibold">{{ title }}</span>
		<span class="flex gap-1">
			<Tag v-for="tag in tags" :text="tag.text" :color="tag.color" />
		</span>
	</div>
</template>
