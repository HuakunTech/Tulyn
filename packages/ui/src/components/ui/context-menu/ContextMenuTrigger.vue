<script setup lang="ts">
import { ContextMenuTrigger, useForwardProps, type ContextMenuTriggerProps } from "radix-vue"

const props = defineProps<ContextMenuTriggerProps>()

const forwardedProps = useForwardProps(props)
</script>

<template>
	<ContextMenuTrigger v-bind="forwardedProps">
		<slot />
	</ContextMenuTrigger>
</template>
