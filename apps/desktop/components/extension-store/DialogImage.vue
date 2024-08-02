<script setup lang="ts">
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "@kksh/vue/carousel"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@kksh/vue/dialog"
import { VisuallyHidden } from "radix-vue"
import type { HTMLAttributes } from "vue"

const props = defineProps<{ class?: HTMLAttributes["class"]; imgSrc: string[]; open?: boolean }>()
const emits = defineEmits<{
	(e: "update:open", open: boolean): void
}>()
</script>

<template>
	<Dialog :open="props.open" @update:open="(_open) => emits('update:open', _open)">
		<DialogContent class="max-h-screen max-w-screen-md">
			<VisuallyHidden>
				<DialogHeader>
					<DialogTitle></DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
			</VisuallyHidden>
			<Carousel class="relative w-full">
				<CarouselContent class="h-full">
					<CarouselItem v-for="src in props.imgSrc" :key="src" class="h-full">
						<img :src="src" class="h-full w-full" alt="" />
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</DialogContent>
	</Dialog>
</template>
