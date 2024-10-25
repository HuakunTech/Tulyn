<script setup lang="ts">
import { listen, TauriEvent, type UnlistenFn } from "@tauri-apps/api/event"
import { onMounted, onUnmounted } from "vue"
import { z } from "zod"

const DropEvent = z.object({
	payload: z.object({
		paths: z.array(z.string())
	})
})
let unlisteners: Record<string, UnlistenFn> = {}

const emits = defineEmits<{
	(e: "drag"): void
	(e: "drop", files: string[]): void
	(e: "dragCancelled"): void
	(e: "dropOver"): void
}>()

onMounted(() => {
	console.log("drag n drop onMounted")

	// start drag, enter window
	listen(TauriEvent.DRAG_ENTER, (event) => {
		emits("drag")
	}).then((unlisten) => {
		unlisteners[TauriEvent.DRAG_ENTER] = unlisten
	})

	// drop file
	listen(TauriEvent.DRAG_DROP, (event) => {
		emits("drop", DropEvent.parse(event).payload.paths)
	}).then((unlisten) => {
		unlisteners[TauriEvent.DRAG_DROP] = unlisten
	})

	// drag cancelled, mouse move out of window
	listen(TauriEvent.DRAG_LEAVE, (event) => {
		emits("dragCancelled")
	}).then((unlisten) => {
		unlisteners[TauriEvent.DRAG_LEAVE] = unlisten
	})

	// drag over window, keep emitting while dragging
	listen(TauriEvent.DRAG_OVER, (event) => {
		emits("dropOver")
		console.log(TauriEvent.DRAG_OVER)
	}).then((unlisten) => {
		unlisteners[TauriEvent.DRAG_OVER] = unlisten
	})
})

onUnmounted(() => {
	Object.values(unlisteners).forEach((unlisten) => unlisten())
})
</script>
<template>
	<span>
		<slot />
	</span>
</template>
