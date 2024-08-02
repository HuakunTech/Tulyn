<script setup lang="ts">
import type { TListItem } from "@/lib/types/list"
import { Button } from "@kksh/vue/button"
import { TrashIcon } from "lucide-vue-next"

const props = defineProps<{ item: TListItem }>()
const emits = defineEmits<{
	(e: "delete", item: TListItem): void
}>()
</script>
<template>
	<div class="flex justify-between text-sm">
		<span>{{ props.item.title }}</span>
		<Button size="icon" variant="outline" @click="emits('delete', props.item)"
			><TrashIcon
		/></Button>
	</div>
	<!-- <Separator class="my-2" /> -->
</template>
