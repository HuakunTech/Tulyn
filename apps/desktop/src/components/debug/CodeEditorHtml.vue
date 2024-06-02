<script setup lang="ts">
import { codeToHtml } from "shikiji";
import { onMounted, ref } from "vue";

const code = "const a = 1"; // input code
const html = ref("");
onMounted(async () => {
  html.value = await codeToHtml(code, {
    lang: "rust",
    theme: "vitesse-dark",
  });
});

console.log(html); // highlighted html string
</script>
<template>
  <div v-html="html"></div>
</template>
