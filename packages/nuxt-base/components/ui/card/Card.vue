<script setup lang="ts">
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "vue"

const props = defineProps<{
	class?: HTMLAttributes["class"]
}>()
</script>

<template>
	<div :class="cn('bg-card text-card-foreground rounded-xl border shadow', props.class)">
		<slot />
	</div>
</template>
