<script lang="ts" setup>
import { useForwardPropsEmits } from "radix-vue"
import type { DrawerRootEmits, DrawerRootProps } from "vaul-vue"
import { DrawerRoot } from "vaul-vue"

const props = withDefaults(defineProps<DrawerRootProps & { open: boolean }>(), {
	shouldScaleBackground: true
})

const emits = defineEmits<
	DrawerRootEmits & {
		(e: "update:open", open: boolean): void
	}
>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
	<DrawerRoot
		v-bind="forwarded"
		:open="props.open"
		@update:open="
			(open) => {
				emits('update:open', open)
			}
		"
	>
		<slot />
	</DrawerRoot>
</template>
