<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { WebviewWindow } from "@tauri-apps/api/webviewWindow"
import {
  getExtLabelMap,
  isWindowLabelRegistered,
  registerExtensionWindow,
  unregisterExtensionWindow
} from "jarvis-api/commands"
import type { ExtensionLabelMap } from "jarvis-api/models"
import { onMounted, ref } from "vue"
import CodeEditor from "./CodeEditor.vue"
import CodeEditorHtml from "./CodeEditorHtml.vue"

const extLabelMapping = ref<ExtensionLabelMap>({})

onMounted(async () => {
  //   await unregisterExtensionWindow("xyz");
  console.log(await getExtLabelMap())
})

async function obtainExtLabelMap() {
  extLabelMapping.value = await getExtLabelMap()
}
</script>
<template>
  <div class="flex flex-col space-y-3">
    <h1 class="text-3xl font-bold">Debug Extension Label</h1>
    <Button @click="obtainExtLabelMap">Obtain Extension Label Mapping</Button>
    <!-- <pre class="break-all whitespace-pre-wrap">{{ JSON.stringify(extLabelMapping, null, 2) }}</pre> -->
    <!-- <CodeEditor language="json" :value="JSON.stringify(extLabelMapping, null, 2)" /> -->
    <CodeEditorHtml
      lang="json"
      theme="one-dark-pro"
      :value="JSON.stringify(extLabelMapping, null, 2)"
    />
  </div>
</template>
