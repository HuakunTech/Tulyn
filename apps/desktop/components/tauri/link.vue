<script setup lang="ts">
import { open } from "tauri-plugin-shellx-api";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  href: string;
  class?: HTMLAttributes["class"];
}>();
</script>
<template>
  <a
    :class="
      cn(
        'font-medium text-blue-600 dark:text-blue-500 hover:underline hover:cursor-pointer',
        props.class,
      )
    "
    @click="
      () => {
        open(props.href);
      }
    "
  >
    <slot />
  </a>
</template>
