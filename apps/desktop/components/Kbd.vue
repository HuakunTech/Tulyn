<script setup lang="ts">
import { cn } from "@/lib/utils"
import { type HtmlHTMLAttributes } from "vue"

const props = defineProps<{ class?: HtmlHTMLAttributes["class"] }>()
</script>
<template>
  <kbd
    :class="
      cn(
        'border min-w-5 h-5 w-5 rounded-sm text-md font-mono bg-muted flex justify-center items-center p-1',
        props.class
      )
    "
  >
    <slot />
  </kbd>
</template>
