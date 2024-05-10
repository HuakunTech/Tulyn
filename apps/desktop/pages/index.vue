<script setup lang="ts">
import { WebviewWindow } from "@tauri-apps/api/window";

function openExt() {
  new WebviewWindow("plugin-b", {
    url: "http://localhost:1566/extensions/myip/dist/",
  });
}
</script>
<template>
  <NuxtLayout>
    <Button @click="openExt()">Click me</Button>
    <ModeToggle />
    <Button>
      <NuxtLink to="/extensions">Extensions</NuxtLink>
    </Button>
  </NuxtLayout>
</template>
