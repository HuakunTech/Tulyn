<script setup lang="ts">
import {
	MenubarRadioGroup,
	useForwardPropsEmits,
	type MenubarRadioGroupEmits,
	type MenubarRadioGroupProps
} from "radix-vue"

const props = defineProps<MenubarRadioGroupProps>()

const emits = defineEmits<MenubarRadioGroupEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
	<MenubarRadioGroup v-bind="forwarded">
		<slot />
	</MenubarRadioGroup>
</template>
