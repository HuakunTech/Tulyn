<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Window } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import {readText} from 'tauri-plugin-clipboard-api';

function loadWebView() {
  const webview = new WebviewWindow("my-label", {
    url: "http://localhost:3000/extensions/qrcode/dist/",
  });
}
</script>
<template>
  <Button @click="loadWebView">Load WebView</Button>
  <Button @click="() => {
    readText().then((text) => {
      console.log(text);
    });
  }">Read Clipboard</Button>
</template>
