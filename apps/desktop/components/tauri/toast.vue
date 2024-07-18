<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import "@/styles/globals.css"
import "@/styles/toast.css"
import { $appConfig } from "@/lib/stores/appConfig"
import { $toasts, dequeueToast } from "@/lib/stores/toast"
import { useStore } from "@nanostores/vue"
import { useColorMode } from "@vueuse/core"

const toasts = useStore($toasts)
const message = ref()

useColorMode()
function handleKeyPress(e: KeyboardEvent) {
  if (e.key === "Escape") {
    // window.closeWindow();
  }
}

function handleToast() {
  console.log(toasts.value)

  const t = dequeueToast()
  console.log(t)

  if (!t) {
    // window.closeWindow();
    return
  }
  message.value = t.message
  setTimeout(() => {
    handleToast()
  }, t.duration)
}

onMounted(() => {
  // parse url query params
  console.log($toasts.get())
  console.log($appConfig.get())

  document.addEventListener("keydown", handleKeyPress)
  handleToast()
})

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyPress)
})
</script>
<template>
  <div
    class="flex h-16 cursor-default select-none items-center justify-center bg-transparent"
    data-tauri-drag-region
  >
    <div
      class="bg-muted/80 rounded-full border-none px-5 py-3 backdrop-blur-2xl"
      data-tauri-drag-region
    >
      <span data-tauri-drag-region class="text-foreground">{{ message }}</span>
    </div>
  </div>
</template>
