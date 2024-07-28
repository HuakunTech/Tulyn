<script lang="ts" setup>
import { cn } from "@/lib/utils"
import type { StepperSeparatorProps } from "radix-vue"
import { StepperSeparator, useForwardProps } from "radix-vue"
import { computed, type HTMLAttributes } from "vue"

const props = defineProps<StepperSeparatorProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
	<StepperSeparator
		v-bind="forwarded"
		:class="
			cn(
				'bg-border h-[1px] w-full',
				// Disabled
				'group-data-[disabled]:bg-muted-foreground group-data-[disabled]:opacity-50',
				// Completed
				'group-data-[state=completed]:bg-accent',
				props.class
			)
		"
	/>
</template>
