<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Window } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { clipboard } from "jarvis-api/ui";
import { invoke } from "@tauri-apps/api/core";

function loadWebView() {
  const webview = new WebviewWindow("my-label", {
    url: "http://localhost:3000/extensions/qrcode/dist/",
  });
}
</script>
<template>
  <Button @click="loadWebView">Load WebView</Button>
  <Button
    @click="
      () => {
        clipboard.readText().then((text) => {
          console.log(text);
        });
      }
    "
    >Read Clipboard</Button
  >
  <Button @click="invoke('toggle_devtools')">Toggle Dev Tool</Button>
</template>
