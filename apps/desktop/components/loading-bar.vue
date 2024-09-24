<script setup lang="ts">
import { cn } from "~/lib/utils"
import type { HTMLAttributes } from "vue"

const props = defineProps<{
	class?: HTMLAttributes["class"]
	color?: string
	duration?: number
}>()
</script>
<template>
	<div :class="cn('h-0.5 w-full', props.class)">
		<div class="relative h-full overflow-hidden">
			<div
				class="loading-bar h-full"
				:style="{ '--color': color ?? 'white', '--width': '30em' }"
			></div>
		</div>
	</div>
</template>
<style scoped>
.loading-bar::before {
	content: "";
	position: absolute;
	display: block;
	width: var(--width);
	height: 100%;
	background: linear-gradient(
		to right,
		transparent,
		var(--color) 40%,
		var(--color) 60%,
		transparent
	);
	opacity: 0.5;
	animation: moveLoadingBar 2s linear infinite;
}
@keyframes moveLoadingBar {
	0% {
		left: calc(var(--width) * -1 / 2);
	}
	50% {
		left: calc(100% - var(--width) / 2);
	}
	100% {
		left: calc(var(--width) * -1 / 2);
	}
}
</style>
