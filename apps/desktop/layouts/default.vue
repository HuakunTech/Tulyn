<script setup lang="ts">
import { tools } from "@jarvis/api";
import { WrenchIcon, RefreshCwIcon, HomeIcon, CogIcon } from "lucide-vue-next";

const config = useRuntimeConfig();
</script>
<template>
  <main class="h-screen">
    <div class="flex flex-col h-full">
      <div data-tauri-drag-region class="h-8">
        <div class="flex space-x-4 float-right px-5 py-2">
          <ModeToggle class="w-4 h-4" />
          <NuxtLink to="/">
            <Button
              v-if="$config.public.IS_DEV"
              class="w-4 h-4"
              size="icon"
              variant="outline"
            >
              <HomeIcon />
            </Button>
          </NuxtLink>
          <NuxtLink to="./dev">
            <Button
              v-if="$config.public.IS_DEV"
              class="w-4 h-4"
              size="icon"
              variant="outline"
            >
              <WrenchIcon />
            </Button>
          </NuxtLink>
          <Button
            v-if="$config.public.IS_DEV"
            @click="tools.toggleDevTools"
            class="w-4 h-4"
            size="icon"
            variant="outline"
          >
            <CogIcon />
          </Button>
        </div>
      </div>
      <div class="grow overflow-auto border-4">
        <slot />
      </div>
    </div>
  </main>
</template>
