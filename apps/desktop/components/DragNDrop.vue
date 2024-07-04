<script setup lang="ts">
import { listen, type UnlistenFn } from "@tauri-apps/api/event"
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
  // start drag, enter window
  listen("tauri://drag", (event) => {
    emits("drag")
  }).then((unlisten) => {
    unlisteners["tauri://drag"] = unlisten
  })

  // drop file
  listen("tauri://drop", (event) => {
    emits("drop", DropEvent.parse(event).payload.paths)
  }).then((unlisten) => {
    unlisteners["tauri://drop"] = unlisten
  })

  // drag cancelled, mouse move out of window
  listen("tauri://drag-cancelled", (event) => {
    emits("dragCancelled")
  }).then((unlisten) => {
    unlisteners["tauri://drag-cancelled"] = unlisten
  })

  // drag over window, keep emitting while dragging
  listen("tauri://drop-over", (event) => {
    emits("dropOver")
  }).then((unlisten) => {
    unlisteners["tauri://drop-over"] = unlisten
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
