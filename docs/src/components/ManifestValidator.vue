<script setup lang="ts">
import { JarvisExtJson } from "@jarvis/api";
import { computed, onMounted, ref, watch } from "vue";

const manifestJson = ref("");
const errMsg = ref<any>();

const isValid = computed(() => !errMsg.value && manifestJson.value.length > 0);

function parse(manifestStr: string) {
  if (manifestStr.length === 0) return;
  try {
    const parsedRes = JarvisExtJson.safeParse(JSON.parse(manifestStr));
    if (parsedRes.error) {
      errMsg.value = parsedRes.error.message;
      console.error(parsedRes.error);
    } else {
      errMsg.value = "";
    }
  } catch (error: unknown) {
    errMsg.value = error;
  }
}

onMounted(() => {
  parse(manifestJson.value);
});

watch(manifestJson, (val, old) => {
  parse(val);
});
</script>
<template>
  <textarea v-model="manifestJson" name="" id="manifest"></textarea>
  <div v-if="errMsg">
    <strong>Error Message: </strong>
    <pre>{{ errMsg }}</pre>
  </div>
  <div>
    <strong>Is Valid:</strong><span>{{ isValid }}</span>
  </div>
</template>
<style scoped>
#manifest {
  width: 100%;
  min-height: 30em;
}
</style>
