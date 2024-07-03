<script lang="ts" setup>
import { allColors } from "@/lib/themes/themes";
import { colors } from "@/lib/themes/colors";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { $appConfig, LightMode, setLightMode, setTheme, setRadius } from "@/lib/stores/appConfig";
import { useStore } from "@nanostores/vue";
import { useColorMode, useDark } from "@vueuse/core";
import { SunIcon, MoonIcon, CheckIcon } from "@radix-icons/vue";

const appConfig = useStore($appConfig);

// const isDark = useDark();
const RADII = [0, 0.25, 0.5, 0.75, 1];
// const appConfig = useAppConfigStore();
const colorMode = useColorMode();

function changeLightMode(mode: LightMode) {
  colorMode.value = mode;
  setLightMode(mode);
}
</script>

<template>
  <div class="p-2">
    <div class="space-y-1.5 pt-6">
      <Label for="color" class="text-xs"> Color </Label>
      <div class="grid grid-cols-3 gap-2 py-1.5">
        <Button
          v-for="(color, index) in allColors"
          :key="index"
          variant="outline"
          class="h-8 justify-start px-3"
          :class="color === appConfig.theme ? 'border-foreground border-2' : ''"
          @click="setTheme(color)"
        >
          <span
            class="h-5 w-5 rounded-full flex items-center justify-center"
            :style="{ backgroundColor: colors[color][7].rgb }"
          >
            <CheckIcon v-if="color === appConfig.theme" class="h-3 w-3 text-white" />
          </span>
          <span class="ml-2 text-xs capitalize">
            {{ color }}
          </span>
        </Button>
      </div>
    </div>
    <div class="space-y-1.5 pt-6">
      <Label for="radius" class="text-xs"> Radius </Label>
      <div class="grid grid-cols-5 gap-2 py-1.5">
        <Button
          v-for="(r, index) in RADII"
          :key="index"
          variant="outline"
          class="h-8 justify-center px-3"
          :class="r === appConfig.radius ? 'border-foreground border-2' : ''"
          @click="setRadius(r)"
        >
          <span class="text-xs">
            {{ r }}
          </span>
        </Button>
      </div>
    </div>
    <div class="space-y-1.5 pt-6">
      <Label for="theme" class="text-xs"> Theme </Label>

      <div class="flex space-x-2 py-1.5">
        <Button
          class="h-8"
          variant="outline"
          :class="{ 'border-2 border-foreground': appConfig.lightMode == 'light' }"
          @click="changeLightMode('light')"
        >
          <SunIcon class="w-4 h-4 mr-2" />
          <span class="text-xs">Light</span>
        </Button>
        <Button
          class="h-8"
          variant="outline"
          :class="{ 'border-2 border-foreground': appConfig.lightMode == 'dark' }"
          @click="changeLightMode('dark')"
        >
          <MoonIcon class="w-4 h-4 mr-2" />
          <span class="text-xs">Dark</span>
        </Button>
        <Button
          class="h-8"
          variant="outline"
          :class="{ 'border-2 border-foreground': appConfig.lightMode == 'auto' }"
          @click="changeLightMode('auto')"
        >
          <MoonIcon class="w-4 h-4 mr-2" />
          <span class="text-xs">System</span>
        </Button>
      </div>
    </div>
  </div>
</template>
