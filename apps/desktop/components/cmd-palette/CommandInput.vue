<script setup lang="ts">
import { cn } from "@/lib/utils"
import { ComboboxInput, useForwardProps, type ComboboxInputProps } from "radix-vue"
import { computed, type HTMLAttributes } from "vue"

defineOptions({
	inheritAttrs: false
})

const props = defineProps<
	ComboboxInputProps & {
		class?: HTMLAttributes["class"]
	}
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<div class="flex items-center gap-2 border-b px-3" cmdk-input-wrapper>
		<slot />
		<ComboboxInput
			v-bind="{ ...forwardedProps, ...$attrs }"
			auto-focus
			:class="
				cn(
					'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
					props.class
				)
			"
		/>
		<slot name="end" />
	</div>
</template>
