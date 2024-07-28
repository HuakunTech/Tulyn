<script setup lang="ts">
import { cn } from "@/lib/utils"
import { CheckIcon } from "@radix-icons/vue"
import {
	RadioGroupIndicator,
	RadioGroupItem,
	useForwardProps,
	type RadioGroupItemProps
} from "radix-vue"
import { computed, type HTMLAttributes } from "vue"

const props = defineProps<RadioGroupItemProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<RadioGroupItem
		v-bind="forwardedProps"
		:class="
			cn(
				'border-primary text-primary focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border shadow focus:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
				props.class
			)
		"
	>
		<RadioGroupIndicator class="flex items-center justify-center">
			<CheckIcon class="fill-primary h-3.5 w-3.5" />
		</RadioGroupIndicator>
	</RadioGroupItem>
</template>
