<script setup lang="ts">
import { cn } from "@/lib/utils"
import { decompressFrame, deserializeFrame } from "@kksh/dance"
import type { HTMLAttributes } from "vue"

const interval = ref<NodeJS.Timeout | null>(null)
const frames = ref<number[][][]>([])
const frameIdx = ref(0)
const frame = computed(() => (frames.value.length ? frames.value[frameIdx.value] : []))
const nFrames = computed(() => frames.value.length)
const height = computed(() => (frame.value ? frame.value.length : 0))
const width = computed(() => (frame.value && frame.value.length ? frame.value[0].length : 0))

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
onMounted(async () => {
	const rawData = (await import("~/assets/dance.json")).default
	const { fps, frames: rawFrames } = rawData
	frames.value = rawFrames.map((frame) => deserializeFrame(decompressFrame(frame)))
	frameIdx.value = Math.floor(Math.random() * nFrames.value)
	interval.value = setInterval(() => {
		frameIdx.value = (frameIdx.value + 1) % nFrames.value
	}, 1000 / fps)
})

onUnmounted(() => {
	if (interval.value) {
		clearInterval(interval.value)
	}
})
</script>
<template>
	<main :class="cn('flex h-full items-center justify-center', props.class)">
		<div>
			<div v-for="row in frame" class="flex">
				<div
					v-for="cell in row"
					:class="
						cn('h-2.5 w-2.5', cell === 0 ? 'bg-white dark:bg-inherit' : 'bg-black dark:bg-white')
					"
				></div>
			</div>
		</div>
	</main>
</template>
