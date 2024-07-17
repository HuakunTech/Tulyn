<script setup lang="ts">
import { useAppUiStore } from "@/stores/ui"
import { Icon } from "@iconify/vue"
import ActionPanel from "./ActionPanel.vue"

const appUiStore = useAppUiStore()
</script>
<template>
  <div data-tauri-drag-region class="h-12 border flex justify-between p-2 items-center">
    <img class="h-6 w-6" src="/img/128x128.png" alt="logo" />
    <span class="flex">
      <Button v-if="appUiStore.defaultAction" variant="ghost" class="">
        <IconMultiplexer
          v-if="appUiStore.defaultAction.icon"
          :icon="appUiStore.defaultAction.icon"
        />
        {{ appUiStore.defaultAction.title }}
      </Button>
      <ActionPanel />
    </span>
  </div>
</template>
