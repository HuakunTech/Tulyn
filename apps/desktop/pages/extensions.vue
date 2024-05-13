<!-- This Page List All Installed Extensions -->
<script setup lang="ts">
import { WebviewWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
import type { ExtInfo } from "~/lib/model";
import { getExtensions } from "~/lib/commands/extension";
import { devtools } from "vue";

const extensions = ref<ExtInfo[]>([]);

const devExts = computed(() => extensions.value.filter((ext) => ext.package_json.jarvis.ui?.startsWith("http")));

const prodExts = computed(() => extensions.value.filter((ext) => !ext.package_json.jarvis.ui?.startsWith("http")));

onMounted(() => {
  getExtensions().then((exts) => {
    extensions.value = exts;
  });
});

function openExt(ext: ExtInfo) {
  const ui = ext.package_json.jarvis.ui;
  if (ui && ui.startsWith("http")) {
    new WebviewWindow("ext-1", { url: ui });
  } else {
    new WebviewWindow("ext-1", {
      title: ext.name,
      url: `http://localhost:1566/extensions/${ext.name}/dist/`,
    });
  }
}
</script>
<template>
  <NuxtLayout>
    <div class="p-4">
      <Button><NuxtLink to="/">Home</NuxtLink></Button>
      <h2 class="text-2xl">Prod Extensions</h2>
      <div class="grid grid-cols-4">
        <span v-for="ext in prodExts" :key="ext.name" class="p-4 text-center">
          <Button variant="secondary" @click="openExt(ext)"
            ><span>{{ ext.name }}</span></Button
          >
        </span>
      </div>
      <h2 class="text-2xl">Dev Extensions</h2>
      <div class="grid grid-cols-4">
        <span v-for="ext in devExts" :key="ext.name" class="p-4 text-center">
          <Button variant="secondary" @click="openExt(ext)"
            ><span>{{ ext.name }}</span></Button
          >
        </span>
      </div>
    </div>
  </NuxtLayout>
</template>
