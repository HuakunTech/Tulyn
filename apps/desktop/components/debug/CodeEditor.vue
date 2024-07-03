<script setup lang="ts">
import { getHighlighter } from "shikiji";
import { shikijiToMonaco } from "shikiji-monaco";
import * as monaco from "monaco-editor-core";
import { onMounted, ref, watch } from "vue";

const themes = ["vitesse-dark", "github-dark", "one-dark-pro", "dark-plus"];
const langs = ["javascript", "typescript", "vue", "json"];
const editorRef = ref(null);
const editor = ref<monaco.editor.IStandaloneCodeEditor>();
const props = defineProps({
  value: String,
  language: String,
  fontSize: {
    type: Number,
    default: 14,
  },
  theme: {
    type: String,
    default: "one-dark-pro",
  },
});

// Register the themes from Shikiji, and provide syntax highlighting for Monaco.
onMounted(async () => {
  // Create the editor

  const highlighter = await getHighlighter({
    themes,
    langs,
  });
  shikijiToMonaco(highlighter, monaco);
  for (const lang of langs) {
    monaco.languages.register({ id: lang });
  }

  if (editorRef.value) {
    editor.value = monaco.editor.create(editorRef.value, {
      value: props.value,
      language: props.language,
      fontSize: props.fontSize,
      theme: props.theme,
    });
  }
});

watch(
  () => props.value,
  () => {
    editor.value?.setValue(props.value ?? "");
  },
);
</script>

<template>
  <div class="editor h-[60vh] border" ref="editorRef"></div>
  <p>{{ props.language }}</p>
</template>
