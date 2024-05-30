<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { currentMonitor } from "@tauri-apps/api/window";
import { onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import { tauriToast } from "./tauri/toast";
import { convertFileSrc } from "@tauri-apps/api/core";
import { ElMessage } from "element-plus";

import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

async function trigger() {
  tauriToast({
    message: "This is a toast",
    duration: 5000,
    variant: "success",
  });
  // const mon = await currentMonitor();
  // if (!mon?.size) {
  //   return;
  // }
  // const { width, height } = mon?.size;
  // new WebviewWindow(`toast-${uuidv4()}`, {
  //   url: "/toast",
  //   decorations: false,
  //   transparent: true,
  //   width: 300,
  //   x: width / 2 - 150,
  //   y: height - 100,
  //   alwaysOnTop: true,
  // });
}

function openWindow() {
  // new WebviewWindow('ext', {
  //   url: convertFileSrc("/Users/hacker/Dev/projects/Jarvis/packages/extensions/jwt/dist/index.html", "extasset")
  // })

  ElMessage({
    message: "Congrats, this is a success message.",
    type: "success",
  });
}
</script>
<template>
  <div>
    <Button @click="trigger">Trigger Toast</Button>
    <Button @click="openWindow">Open Window</Button>
    <el-button>Default</el-button>
  </div>
</template>
