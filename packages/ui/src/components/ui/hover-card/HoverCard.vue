<script setup lang="ts">
import {
	HoverCardRoot,
	useForwardPropsEmits,
	type HoverCardRootEmits,
	type HoverCardRootProps
} from "radix-vue"

const props = defineProps<HoverCardRootProps>()
const emits = defineEmits<HoverCardRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
	<HoverCardRoot v-bind="forwarded">
		<slot />
	</HoverCardRoot>
</template>
