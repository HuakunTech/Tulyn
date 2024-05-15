<script setup lang="ts">
import { onMounted, ref } from "vue";
import { createEditor } from "./index";

const editorRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (editorRef.value) {
    createEditor(editorRef.value);
  }
});
</script>
<template>
  <div class="h-full" ref="editorRef"></div>
</template>
