<script setup lang="ts">
import { cn } from "@/lib/utils"
import { type HtmlHTMLAttributes } from "vue"

const props = defineProps<{ class?: HtmlHTMLAttributes; modelValue: string }>()
</script>
<template>
  <kbd :class="cn('border min-w-5 px-2 h-5 rounded-sm text-md font-mono')">{{ modelValue }}</kbd>
</template>
