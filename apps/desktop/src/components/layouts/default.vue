<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { onMounted, watch } from "vue";
import { $appConfig, LightMode, setLightMode, setTheme, setRadius } from "@/lib/stores/appConfig";
import { useStore } from "@nanostores/vue";
import { allColors } from "@/lib/themes/themes";

const appConfig = useStore($appConfig);

const colorMode = useColorMode();

onMounted(() => {
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
  <slot />
</template>
