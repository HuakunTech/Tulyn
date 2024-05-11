<script setup lang="ts">
import { tools } from "@jarvis/api";
import { WrenchIcon, RefreshCwIcon, HomeIcon, CogIcon } from "lucide-vue-next";

const config = useRuntimeConfig();
</script>
<template>
  <div data-tauri-drag-region class="h-8">
    <div class="flex space-x-4 float-right pr-5">
      <NuxtLink to="/">
        <Button
          v-if="$config.public.IS_DEV"
          class="w-4"
          size="icon"
          variant="ghost"
        >
          <HomeIcon />
        </Button>
      </NuxtLink>
      <NuxtLink to="./dev">
        <Button
          v-if="$config.public.IS_DEV"
          class="w-4"
          size="icon"
          variant="ghost"
        >
          <WrenchIcon />
        </Button>
      </NuxtLink>
      <Button
        v-if="$config.public.IS_DEV"
        @click="tools.openDevTools"
        class="w-4"
        size="icon"
        variant="ghost"
      >
        <CogIcon />
      </Button>
    </div>
  </div>
  <slot />
</template>
