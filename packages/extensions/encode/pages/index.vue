<script setup lang="ts">
const count = ref(0);
</script>
<template>
  <NuxtLayout>
    <h1 class="text-3xl">Nuxt Extension Template for Jarvis</h1>
    <div class="flex items-center space-x-5">
      <mode-toggle />
      <Button @click="count++">Increment: {{ count }}</Button>
    </div>
  </NuxtLayout>
</template>
