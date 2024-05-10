<script setup lang="ts">
import { tools } from "@jarvis/api";
import { GearIcon } from "@radix-icons/vue";

// get node-env
const config = useRuntimeConfig();
</script>
<template>
  <div data-tauri-drag-region class="h-8">
    <Button
      v-if="$config.public.IS_DEV"
      @click="tools.openDevTool"
      class="right-0 float-right"
      size="icon"
      variant="ghost"
    >
      <GearIcon />
    </Button>
  </div>
  <slot />
</template>
