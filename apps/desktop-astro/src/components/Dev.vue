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
</script>
<template>
  <div>
    <el-button>Default</el-button>
  </div>
</template>
