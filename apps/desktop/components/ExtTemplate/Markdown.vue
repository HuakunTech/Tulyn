<script setup lang="ts">
defineProps<{
  markdown: string
}>()
</script>
<template>
  <div class="prose dark:prose-invert">
    <MDC :value="markdown" />
  </div>
</template>
