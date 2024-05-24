<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { default as TauriLink } from "@/components/tauri/link.vue";
import { getVersion } from "@tauri-apps/api/app";
import { onMounted, ref, type HTMLAttributes } from "vue";
import { Icon } from "@iconify/vue";
import { cn } from "@/lib/utils";

const appVersion = ref("");
onMounted(() => {
  getVersion().then((version) => {
    appVersion.value = version;
  });
});
const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
<template>
  <Card
    :class="
      cn('h-full border-none flex justify-center items-center border-2 border-red-500', props.class)
    "
  >
    <CardContent class="flex space-x-5 items-center">
      <img src="/128x128.png" class=" w-44" />
      <div class="flex flex-col space-y-1">
        <p class="text-3xl font-bold">Jarvis</p>
        <p class="text-xs">Version: {{ appVersion }}</p>
        <p>
          <strong class="font-bold">Author: </strong>
          <TauriLink href="https://github.com/HuakunShen">
            @HuakunShen
            <Icon icon="mdi:github" class="inline text-white -translate-y-0.5" />
          </TauriLink>
        </p>
        <TauriLink href="https://github.com/HuakunTech/Jarvis">
          Jarvis Source Code
          <Icon icon="mdi:github" class="inline text-white -translate-y-0.5" />
        </TauriLink>
        <TauriLink href="https://github.com/HuakunTech/JarvisExtensions">
          Extensions Source Code
          <Icon icon="mdi:github" class="inline text-white -translate-y-0.5" />
        </TauriLink>
      </div>
    </CardContent>
  </Card>
</template>
