<script setup lang="ts">
import { WebviewWindow } from "@tauri-apps/api/window";
import { appDataDir } from "@tauri-apps/api/path";
import {
  startServer,
  stopServer,
  serverIsRunning,
} from "@/lib/commands/server";

import { Store } from "tauri-plugin-store-api";

const store = new Store(".settings.dat");

await store.set("some-key", { value: 5 });

const val = await store.get<{ value: number }>("some-key");

if (val) {
  console.log(val);
} else {
  console.log("val is null");
}

console.log(await appDataDir());

// This manually saves the store.
await store.save();
</script>
<template>
  <NuxtLayout>
    <main class="px-5">
      <Button @click="startServer">Start Server</Button>
      <ModeToggle />
      <Button>
        <NuxtLink to="/extensions">Extensions</NuxtLink>
      </Button>
    </main>
  </NuxtLayout>
</template>
