<script setup lang="ts">
import TauriLink from "@/components/tauri/link.vue"

const props = defineProps<{
	text: string
	title: string
	url: string
}>()
</script>
<template>
	<div class="flex justify-between gap-1 py-1">
		<span class="text-muted-foreground text-sm font-semibold">{{ props.title }}</span>
		<TauriLink :href="url" class="flex items-center justify-center gap-1">
			<span class="text-sm">{{ props.text }}</span>
			<Icon name="gridicons:external" />
		</TauriLink>
	</div>
</template>
