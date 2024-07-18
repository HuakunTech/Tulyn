<script setup lang="ts">
import Kbd from "@/components/Kbd.vue"
import { useAppUiStore } from "@/stores/ui"
import ActionPanel from "./ActionPanel.vue"

const appUiStore = useAppUiStore()
</script>
<template>
  <div data-tauri-drag-region class="flex h-12 items-center justify-between border p-2">
    <img class="h-6 w-6" src="/img/128x128.png" alt="logo" />
    <span class="flex">
      <Button v-if="appUiStore.defaultAction" variant="ghost" class="gap-2">
        {{ appUiStore.defaultAction }}
        <Kbd><Icon name="tdesign:enter" /></Kbd>
      </Button>
      <ActionPanel />
    </span>
  </div>
</template>
