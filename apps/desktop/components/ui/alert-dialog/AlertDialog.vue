<script setup lang="ts">
import {
	AlertDialogRoot,
	useForwardPropsEmits,
	type AlertDialogEmits,
	type AlertDialogProps
} from "radix-vue"

const props = defineProps<AlertDialogProps>()
const emits = defineEmits<AlertDialogEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
	<AlertDialogRoot v-bind="forwarded">
		<slot />
	</AlertDialogRoot>
</template>
