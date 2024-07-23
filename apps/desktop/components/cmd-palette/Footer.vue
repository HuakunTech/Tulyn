<script setup lang="ts">
import Kbd from "@/components/Kbd.vue"
import { cn } from "@/lib/utils"
import { useAppUiStore } from "@/stores/ui"
import { Icon } from "@iconify/vue"
import ActionPanel from "./ActionPanel.vue"

const appUiStore = useAppUiStore()
</script>
<template>
  <div data-tauri-drag-region class="flex h-12 items-center justify-between border p-2">
    <img :class="cn('h-6 w-6', 'invert dark:invert-0')" src="/img/logo-w-bg.png" alt="logo" />
    <span class="flex">
      <Button v-if="appUiStore.defaultAction" variant="ghost" class="gap-2">
        {{ appUiStore.defaultAction }}
        <Kbd><Icon icon="tdesign:enter" /></Kbd>
      </Button>
      <ActionPanel />
    </span>
  </div>
</template>
