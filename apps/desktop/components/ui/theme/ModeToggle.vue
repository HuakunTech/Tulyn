<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LightMode, useAppConfigStore } from "~/stores/appConfig";

const props = defineProps<{
  class?: string;
}>();
const colorMode = useColorMode();
const appConfig = useAppConfigStore();

function setLightMode(mode: LightMode) {
  colorMode.preference = mode;
  appConfig.setLightMode(mode);
}
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" :class="cn('border-none focus:border-none outline-none', props.class)">
        <Icon icon="ant-design:moon-filled" class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 h-4 w-4" />
        <Icon icon="ant-design:sun-filled" class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 h-4 w-4" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="setLightMode('light')"> Light </DropdownMenuItem>
      <DropdownMenuItem @click="setLightMode('dark')"> Dark </DropdownMenuItem>
      <DropdownMenuItem @click="setLightMode('system')"> System </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
