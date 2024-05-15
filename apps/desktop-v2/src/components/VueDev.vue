<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Window } from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";

function loadWebView() {
  const appWindow = new Window("astro");
  console.log("window");
  const webview = new Webview(appWindow, "astro-label", {
    url: "/about",
    // url: 'https://github.com/tauri-apps/tauri',
  });
}
</script>
<template>
  <Button @click="loadWebView">Load WebView</Button>
</template>
