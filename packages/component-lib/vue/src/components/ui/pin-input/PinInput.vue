<script setup lang="ts">
import { cn } from "@/lib/utils"
import {
	PinInputRoot,
	useForwardPropsEmits,
	type PinInputRootEmits,
	type PinInputRootProps
} from "radix-vue"
import { computed, type HTMLAttributes } from "vue"

const props = withDefaults(defineProps<PinInputRootProps & { class?: HTMLAttributes["class"] }>(), {
	modelValue: () => []
})
const emits = defineEmits<PinInputRootEmits>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props
	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
	<PinInputRoot v-bind="forwarded" :class="cn('flex items-center gap-2', props.class)">
		<slot />
	</PinInputRoot>
</template>
