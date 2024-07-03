<script setup lang="ts">
import { Icon } from "@iconify/vue";
import ActionPanel from "./ActionPanel.vue";
</script>
<template>
  <div data-tauri-drag-region class="h-12 border flex justify-between p-2 items-center">
    <img class="h-6 w-6" src="/img/128x128.png" alt="logo" />
    <span class="flex">
      <Button variant="ghost" role="combobox" class="gap-2">
        Copy
        <span class="flex items-center gap-1">
          <Icon icon="tdesign:enter" />
        </span>
      </Button>
      <!-- <VertifcalSeparator /> -->
      <ActionPanel />
    </span>
  </div>
</template>
