<script setup lang="ts">
import { cn } from "@/lib/utils"
import { ToastRoot, useForwardPropsEmits, type ToastRootEmits } from "radix-vue"
import { computed } from "vue"
import { toastVariants, type ToastProps } from "."

const props = defineProps<ToastProps>()

const emits = defineEmits<ToastRootEmits>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
	<ToastRoot
		v-bind="forwarded"
		:class="cn(toastVariants({ variant }), props.class)"
		@update:open="onOpenChange"
	>
		<slot />
	</ToastRoot>
</template>
