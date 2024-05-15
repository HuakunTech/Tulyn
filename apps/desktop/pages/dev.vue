<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { WebviewWindow } from "@tauri-apps/api/window";
import { convertFileSrc } from "@tauri-apps/api/tauri";

function largeType() {
  new WebviewWindow("large-type", {
    url: "/large-type",
    transparent: true,
    decorations: false,
    fullscreen: false,
    title: "",
    hiddenTitle: true,
    center: true,
  });
}

const assetUrl = convertFileSrc(
  "/Users/hacker/Dev/projects/Jarvis/dev/extensions/myip/dist/index.html",
);
function convertSrc() {
  console.log(assetUrl);
  
  new WebviewWindow("convert-src", {
    url: assetUrl,
  });
  // console.log(assetUrl);
}

const url = ref("");
</script>
<template>
  <NuxtLayout>
    <!-- <Button @click="largeType">Large Type</Button> -->
    <div class="w-64">
      <div class="flex">
        <Input placeholder="URL" v-model="url" /><Button
          @click="
            async () => {
              await navigateTo(url);
            }
          "
          >Go</Button
        >
      </div>
    </div>
    <div>
      <Button @click="convertSrc">Convert Src</Button>
    </div>
  </NuxtLayout>
</template>
