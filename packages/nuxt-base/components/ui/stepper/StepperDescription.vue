<script lang="ts" setup>
import { cn } from "@/lib/utils"
import type { StepperDescriptionProps } from "radix-vue"
import { StepperDescription, useForwardProps } from "radix-vue"
import { computed, type HTMLAttributes } from "vue"

const props = defineProps<StepperDescriptionProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
	<StepperDescription v-bind="forwarded" :class="cn('text-muted-foreground text-xs', props.class)">
		<slot />
	</StepperDescription>
</template>
