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
    <main class="px-5">
      <Button @click="openExt()">Click me</Button>
      <ModeToggle />
      <Button>
        <NuxtLink to="/extensions">Extensions</NuxtLink>
      </Button>
      <!-- <Button @click="startServer">Start</Button>
      <Button @click="stopServer">Stop</Button>
      <Button @click="serverIsRunning">Is Running</Button> -->
    </main>
  </NuxtLayout>
</template>
