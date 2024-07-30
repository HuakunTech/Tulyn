<script setup lang="ts">
import {
	ContextMenuSub,
	useForwardPropsEmits,
	type ContextMenuSubEmits,
	type ContextMenuSubProps
} from "radix-vue"

const props = defineProps<ContextMenuSubProps>()
const emits = defineEmits<ContextMenuSubEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
	<ContextMenuSub v-bind="forwarded">
		<slot />
	</ContextMenuSub>
</template>
