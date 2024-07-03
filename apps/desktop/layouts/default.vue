<script setup lang="ts">
import type { UnlistenFn } from "@tauri-apps/api/event";
import { allColors } from "@/lib/themes/themes";
import { attachConsole } from "@tauri-apps/plugin-log";
import { useStore } from "@nanostores/vue";
import { $appConfig, LightMode, setLightMode, setTheme, setRadius } from "@/lib/stores/appConfig";
import { Toaster } from "@/components/ui/sonner";

const colorMode = useColorMode(); // auto set html class to dark is in dark mode
const appConfig = useStore($appConfig);
let detach: UnlistenFn;

onMounted(async () => {
  detach = await attachConsole();
  /* -------------------------------------------------------------------------- */
  /*                            Theme and Style Init                            */
  /* -------------------------------------------------------------------------- */
  document.documentElement.style.setProperty("--radius", `${appConfig.value.radius}rem`);
  document.documentElement.classList.add(`theme-${appConfig.value.theme}`);
  colorMode.value = appConfig.value.lightMode ?? "system";
});

watch(
  () => appConfig.value.theme,
  (theme) => {
    document.documentElement.classList.remove(...allColors.map((color) => `theme-${color}`));
    document.documentElement.classList.add(`theme-${theme}`);
  },
);

watch(
  () => appConfig.value.radius,
  (radius) => {
    document.documentElement.style.setProperty("--radius", `${radius}rem`);
  },
);
</script>

<template>
  <main class="h-screen">
    <Toaster :rich-colors="true" :expand="true" />
    <slot />
  </main>
</template>

<style>
.dark {
  color-scheme: dark;
}
</style>
