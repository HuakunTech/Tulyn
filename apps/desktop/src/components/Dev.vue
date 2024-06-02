<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { currentMonitor } from "@tauri-apps/api/window";
import { onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import { tauriToast } from "./tauri/toast";
import { convertFileSrc } from "@tauri-apps/api/core";
import { ElMessage } from "element-plus";
import { Command } from "@tauri-apps/plugin-shell";
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

onMounted(async () => {
  // const output = await Command.create("exec-echo", ["message"]).execute();
  // console.log(output);
  // console.log(output.stdout);

  // assert(output.code === 0);
  // assert(output.signal === null);
  // assert(output.stdout === "message");
  // assert(output.stderr === "");
  // const command = Command.create("exec-echo", ["hello"]);
  const command = Command.create("exec-ffprobe", ["/Users/hacker/Desktop/kxzp.mp4"]);
  // const out = await command.execute()
  // console.log(out.stdout);
  
  // const command = Command.create("exec-bash", ["-c", "echo hello world", ""]);
  // const command = Command.create("exec-bash", ["-c", "ps aux"]);
  
  command.on("close", (data) => {
    console.log(`command finished with code ${data.code} and signal ${data.signal}`);
  });
  command.on("error", (error) => console.error(`command error: "${error}"`));
  command.stdout.on("data", (line) => console.log(`command stdout: "${line}"`));
  command.stderr.on("data", (line) => console.log(`command stderr: "${line}"`));

  const child = await command.spawn();
  console.log("pid:", child.pid);
});

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
