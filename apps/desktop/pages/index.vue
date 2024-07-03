<script setup lang="ts">
// import { getServerPort } from "tauri-plugin-jarvis-api/commands";
import { getServerPort } from "@jarvis-plugin/commands";

onMounted(() => {
  getServerPort().then(console.log);
});
</script>
<template></template>
