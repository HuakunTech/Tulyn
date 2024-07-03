<script setup lang="ts">
import { Icon } from "@iconify/vue"
import ActionPanel from "./ActionPanel.vue"
</script>
<template>
  <div data-tauri-drag-region class="h-12 border flex justify-between p-2 items-center">
    <img class="h-6 w-6" src="/img/128x128.png" alt="logo" />
    <span class="flex">
      <ActionPanel />
    </span>
  </div>
</template>
