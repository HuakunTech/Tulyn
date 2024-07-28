<script setup lang="ts">
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "vue"

const props = defineProps<{
	class?: HTMLAttributes["class"]
}>()
</script>

<template>
	<th
		:class="
			cn(
				'text-muted-foreground h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5',
				props.class
			)
		"
	>
		<slot />
	</th>
</template>
