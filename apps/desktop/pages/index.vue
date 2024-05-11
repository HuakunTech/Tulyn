<script setup lang="ts">
import { WebviewWindow } from "@tauri-apps/api/window";
import {
  startServer,
  stopServer,
  serverIsRunning,
} from "@/lib/commands/server";
</script>
<template>
  <NuxtLayout>
    <main class="px-5">
      <Button @click="startServer">Start Server</Button>
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
