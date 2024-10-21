<script setup lang="ts">
import type { Color, ListSchema } from "@kksh/api/ui/worker"
import { Badge } from "@kksh/vue/badge"

export type Tag = {
	text?: string
	color?: Color
	// icon?: Icon
}

const props = defineProps<Tag>()
</script>
<template>
	<Badge
		:style="{
			color: props.color ? props.color : 'var(--muted-foreground)',
			backgroundColor: props.color ? `${props.color}30` : 'var(--muted)'
		}"
	>
		{{ props.text }}
	</Badge>
</template>
