<!-- This Page List All Installed Extensions -->
<script setup lang="ts">
import { WebviewWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";

const extensions = ref<{ name: string; path: string }[]>([]);

onMounted(() => {
  invoke("get_extensions_info").then((exts) => {
    console.log(exts);
    extensions.value = exts;
  });
});

function openExt(ext: { name: string; path: string }) {
  new WebviewWindow(ext.name, {
    url: `http://localhost:1566/extensions/${ext.name}/dist/`,
  });
}
</script>
<template>
  <NuxtLayout>
    <Button><NuxtLink to="/">Home</NuxtLink></Button>
    <div class="grid grid-cols-4">
      <!-- Iterate extensions -->
      <span v-for="ext in extensions" :key="ext.name" class="p-4 border">
        <Button variant="ghost" @click="openExt(ext)"
          ><span>{{ ext.name }}</span></Button
        >

        <!-- <p>{{ ext.path }}</p> -->
      </span>
    </div>
  </NuxtLayout>
</template>
