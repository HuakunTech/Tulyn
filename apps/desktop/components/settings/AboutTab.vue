<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { getVersion } from "@tauri-apps/api/app";
import type { HTMLAttributes } from "vue";
import { Icon } from "@iconify/vue";
import { cn } from "@/lib/utils";

const appVersion = await getVersion();
const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
<template>
  <Card
    :class="
      cn('h-full border-none flex justify-center items-center', props.class)
    "
  >
    <CardContent class="flex space-x-5 items-center">
      <NuxtImg src="/images/128x128.png" class="w-36" />
      <div class="flex flex-col space-y-1">
        <p class="text-3xl font-bold">Jarvis</p>
        <p class="text-xs">Version: {{ appVersion }}</p>
        <p>
          <strong class="font-bold">Author: </strong>
          <TauriLink href="https://github.com/HuakunShen">
            @HuakunShen
            <Icon
              icon="mdi:github"
              class="inline text-white -translate-y-0.5"
            />
          </TauriLink>
        </p>
      </div>
    </CardContent>
  </Card>
</template>
