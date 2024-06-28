<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { onMounted, onUnmounted, watch } from "vue";
import { $appConfig, LightMode, setLightMode, setTheme, setRadius } from "@/lib/stores/appConfig";
import { useStore } from "@nanostores/vue";
import { allColors } from "@/lib/themes/themes";
import { KeyComb, SettingsKeyComb } from "@/lib/utils/keycomb";
import { GlobalEventBus } from "@/lib/utils/events";
import { trace, info, error, attachConsole } from "@tauri-apps/plugin-log";
import type { UnlistenFn } from "@tauri-apps/api/event";

let detach: UnlistenFn;

const appConfig = useStore($appConfig);
const colorMode = useColorMode();

onMounted(async () => {
  detach = await attachConsole();
  info("Enter app (default.vue)");
  /* -------------------------------------------------------------------------- */
  /*                            Theme and Style Init                            */
  /* -------------------------------------------------------------------------- */
  document.documentElement.style.setProperty("--radius", `${appConfig.value.radius}rem`);
  document.documentElement.classList.add(`theme-${appConfig.value.theme}`);
  colorMode.value = appConfig.value.lightMode ?? "system";
  /* -------------------------------------------------------------------------- */
  /*                      Global Key Combination Detection                      */
  /* -------------------------------------------------------------------------- */

  document.addEventListener("keydown", KeyComb.onKeyDown);
  document.addEventListener("keydown", GlobalEventBus.emitKeyDown);
  document.addEventListener("keyup", KeyComb.onKeyUp);

  GlobalEventBus.setupSettingsKeyComb();
  // await loadAllExtensionsManifest();
});

onUnmounted(() => {
  document.removeEventListener("keydown", KeyComb.onKeyDown);
  document.removeEventListener("keydown", GlobalEventBus.emitKeyDown);
  document.removeEventListener("keyup", KeyComb.onKeyUp);
  GlobalEventBus.removeSettingsKeyComb();
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
  <slot />
</template>
