<script lang="ts" setup>
import { CalendarGridHead, type CalendarGridHeadProps } from "radix-vue"
import type { HTMLAttributes } from "vue"

const props = defineProps<CalendarGridHeadProps & { class?: HTMLAttributes["class"] }>()
</script>

<template>
	<CalendarGridHead v-bind="props">
		<slot />
	</CalendarGridHead>
</template>
