<script setup lang="ts">
import { cn } from "@/lib/utils"
import { Separator } from "@kksh/vue"
import type { HTMLAttributes } from "vue"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
	<div :class="cn('flex items-center justify-center space-x-5', props.class)">
		<span class="w-full">
			<Separator />
		</span>
		<slot />
		<span class="w-full">
			<Separator />
		</span>
	</div>
</template>
