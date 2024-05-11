<script setup lang="ts">
import { WebviewWindow } from "@tauri-apps/api/window";
import { Input } from "@/components/ui/input";
import { appDataDir } from "@tauri-apps/api/path";
import {
  startServer,
  stopServer,
  serverIsRunning,
} from "@/lib/commands/server";
import { apps } from "@jarvis/api";

const userInput = ref("");
const allApps = ref<any[]>([]);
const foundApps = ref<any[]>([]);
watch(userInput, (value) => {
  console.log(value);
  foundApps.value = allApps.value.filter((app: any) =>
    (app.name as string).toLowerCase().includes(value.toLowerCase()),
  );
});

onMounted(async () => {
  allApps.value = (await apps.getAllApps()) as any[];
  console.log(allApps.value);
});
</script>
<template>
  <NuxtLayout>
    <main class="px-5">
      <Button @click="startServer">Start Server</Button>
      <ModeToggle />
      <Button>
        <NuxtLink to="/extensions">Extensions</NuxtLink>
      </Button>
      <Input v-model="userInput" />
      <pre>
        {{ JSON.stringify(foundApps, null, 2) }}
      </pre>
    </main>
  </NuxtLayout>
</template>
