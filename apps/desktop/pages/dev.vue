<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { WebviewWindow } from "@tauri-apps/api/window";

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
</script>
<template>
  <NuxtLayout>
    <Button @click="largeType">Large Type</Button>
  </NuxtLayout>
</template>
