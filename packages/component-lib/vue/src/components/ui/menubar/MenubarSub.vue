<script setup lang="ts">
import { MenubarSub, useForwardPropsEmits, type MenubarSubEmits } from "radix-vue"

interface MenubarSubRootProps {
	defaultOpen?: boolean
	open?: boolean
}

const props = defineProps<MenubarSubRootProps>()
const emits = defineEmits<MenubarSubEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
	<MenubarSub v-bind="forwarded">
		<slot />
	</MenubarSub>
</template>
