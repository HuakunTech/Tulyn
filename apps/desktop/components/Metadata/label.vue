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
		<span class="text-muted-foreground text-sm font-semibold">{{ props.title }}</span>
		<span class="flex items-center gap-2">
			<IconMultiplexer v-if="props.icon" :icon="props.icon" h-4 w-4 />
			<span class="text-sm">{{ props.text }}</span>
		</span>
	</div>
</template>
