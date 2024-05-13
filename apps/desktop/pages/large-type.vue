<script setup lang="ts">
import { appWindow } from "@tauri-apps/api/window";

function keydownHandler(e: KeyboardEvent) {
  if (e.key === "Escape") {
    appWindow.close();
  }
}

onMounted(() => {
  document.addEventListener("keydown", keydownHandler);
});

onUnmounted(() => {
  document.removeEventListener("keydown", keydownHandler);
});
</script>
<template>
  <div class="large-type h-screen w-screen flex justify-center items-center" data-tauri-drag-region>
    <h1 class="text-9xl font-bold">Hello</h1>
  </div>
</template>