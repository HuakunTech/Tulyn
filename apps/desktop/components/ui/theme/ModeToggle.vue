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
import { LightMode, useAppStore } from "~/stores/app";

const props = defineProps<{
  class?: string;
}>();
const colorMode = useColorMode();
const appConfig = useAppStore();

function setLightMode(mode: LightMode) {
  colorMode.preference = mode;
  appConfig.setLightMode(mode);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" :class="cn('', props.class)">
        <Icon icon="radix-icons:moon" class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Icon icon="radix-icons:sun" class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
