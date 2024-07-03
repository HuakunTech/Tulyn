<script setup lang="ts">
import CodeEditor from "./CodeEditor.vue";
import DebugExtLabelMap from "./DebugExtLabelMap.vue";
</script>
<template>
  <div class="px-3 flex flex-col space-y-4 overflow-x-clip">
    <DebugExtLabelMap />
    <Separator />
    <!-- <CodeEditor language="javascript" /> -->
    <!-- <CodeEditorHtml /> -->
  </div>
</template>
