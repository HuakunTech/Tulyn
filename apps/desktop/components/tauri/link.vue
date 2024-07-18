<script setup lang="ts">
import { cn } from "@/lib/utils"
import { open } from "tauri-plugin-shellx-api"
import type { HTMLAttributes } from "vue"

const props = defineProps<{
  href: string
  class?: HTMLAttributes["class"]
}>()
</script>
<template>
  <a
    :class="
      cn(
        'font-medium text-blue-600 hover:cursor-pointer hover:underline dark:text-blue-500',
        props.class
      )
    "
    @click="
      () => {
        open(props.href)
      }
    "
  >
    <slot />
  </a>
</template>
