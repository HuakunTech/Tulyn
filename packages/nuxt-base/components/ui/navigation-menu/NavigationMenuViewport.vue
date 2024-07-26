<script setup lang="ts">
import { cn } from "@/lib/utils"
import {
	NavigationMenuViewport,
	useForwardProps,
	type NavigationMenuViewportProps
} from "radix-vue"
import { computed, type HTMLAttributes } from "vue"

const props = defineProps<NavigationMenuViewportProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<div class="absolute left-0 top-full flex justify-center">
		<NavigationMenuViewport
			v-bind="forwardedProps"
			:class="
				cn(
					'origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[--radix-navigation-menu-viewport-height] w-full overflow-hidden rounded-md border shadow md:w-[--radix-navigation-menu-viewport-width]',
					props.class
				)
			"
		/>
	</div>
</template>
