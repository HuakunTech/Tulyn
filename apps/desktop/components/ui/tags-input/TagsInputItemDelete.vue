<script setup lang="ts">
import { cn } from "@/lib/utils"
import { Cross2Icon } from "@radix-icons/vue"
import { TagsInputItemDelete, useForwardProps, type TagsInputItemDeleteProps } from "radix-vue"
import { computed, type HTMLAttributes } from "vue"

const props = defineProps<TagsInputItemDeleteProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<TagsInputItemDelete
		v-bind="forwardedProps"
		:class="cn('mr-1 flex rounded bg-transparent', props.class)"
	>
		<slot>
			<Cross2Icon class="h-4 w-4" />
		</slot>
	</TagsInputItemDelete>
</template>
