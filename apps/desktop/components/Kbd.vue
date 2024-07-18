<script setup lang="ts">
import { cn } from "@/lib/utils"
import { type HtmlHTMLAttributes } from "vue"

const props = defineProps<{ class?: HtmlHTMLAttributes["class"] }>()
</script>
<template>
  <kbd
    :class="
      cn(
        'text-md bg-muted flex h-5 w-5 min-w-5 items-center justify-center rounded-sm border p-1 font-mono',
        props.class
      )
    "
  >
    <slot />
  </kbd>
</template>
