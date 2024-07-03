<script setup lang="ts">
import { codeToHtml } from "shikiji"
import { computed, onMounted, ref, watch } from "vue"
import { computedAsync } from "@vueuse/core"

const props = defineProps<{
  lang: string
  theme: string
  value: string
}>()

const html = ref("")

watch(
  () => props.value,
  async () => {
    html.value = await codeToHtml(props.value, {
      lang: props.lang,
      theme: props.theme
    })
  }
)
</script>
<template>
  <div class="" v-html="html"></div>
</template>
