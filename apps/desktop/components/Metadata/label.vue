<script setup lang="ts">
import type { IconType, List, ListSchema } from "@kksh/api/ui/worker"

const props = defineProps<{
	title: string
	text?:
		| string
		| {
				text: string
				color: string
		  }
	icon?: {
		type: IconType
		value: string
	}
}>()
</script>
<template>
	<div class="flex justify-between gap-1 py-1">
		<span class="text-muted-foreground">{{ props.title }}</span>
		<span class="">{{ props.text }}</span>
	</div>
</template>
