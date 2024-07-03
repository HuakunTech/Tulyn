<script setup lang="ts">
const colorMode = useColorMode(); // auto set html class to dark is in dark mode
</script>

<template>
  <main class="flex flex-col h-screen">
    <slot />
  </main>
</template>
