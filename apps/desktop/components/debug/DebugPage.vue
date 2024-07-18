<script setup lang="ts">
import CodeEditor from "./CodeEditor.vue"
import DebugExtLabelMap from "./DebugExtLabelMap.vue"
</script>
<template>
  <div class="flex flex-col space-y-4 overflow-x-clip px-3">
    <DebugExtLabelMap />
    <Separator />
    <!-- <CodeEditor language="javascript" /> -->
    <!-- <CodeEditorHtml /> -->
  </div>
</template>
