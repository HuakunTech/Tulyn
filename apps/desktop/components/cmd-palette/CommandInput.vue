<script setup lang="ts">
import CmdPaletteQuickLinks from "@/components/cmd-palette/QuickLinks.vue"
import { cn } from "@/lib/utils"
import { ComboboxInput, useForwardProps, type ComboboxInputProps } from "radix-vue"
import { computed, type HTMLAttributes } from "vue"

defineOptions({
	inheritAttrs: false
})

const quickLinkInputs = defineModel<QuickLinkQuery[]>("quickLinkInputs")

const props = defineProps<
	ComboboxInputProps & {
		class?: HTMLAttributes["class"]
		searchTerm: string
		// quickLinkInputs: QuickLinkQuery[]
	}
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
const emit = defineEmits<{
	(e: "quicklink-enter"): void
}>()
</script>

<template>
	<div class="flex items-center gap-2 border-b px-3" cmdk-input-wrapper data-tauri-drag-region>
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
		<CmdPaletteQuickLinks
			v-if="searchTerm"
			@enter="emit('quicklink-enter')"
			:searchTerm="searchTerm"
			v-model:quickLinkInputs="quickLinkInputs"
		/>
		<slot name="end" data-tauri-drag-region />
	</div>
</template>
