<script setup lang="ts">
import { useColorMode, useDark } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: string;
}>();
const mode = useColorMode();
const isDark = useDark();
</script>

<template>
  <span>
    <DropdownMenu>
      <DropdownMenuTrigger as-child class="">
        <button :class="cn('', props.class)">
          <Icon
            v-if="!isDark"
            icon="fxemoji:sunrays"
            class="rotate-0 scale-100 transition-all dark:-rotate-90 h-4 w-4"
          />
          <Icon
            v-if="isDark"
            icon="fluent-emoji-flat:crescent-moon"
            class="rotate-0 scale-100 transition-all h-4 w-4"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="mode = 'light'"> Light </DropdownMenuItem>
        <DropdownMenuItem @click="mode = 'dark'"> Dark </DropdownMenuItem>
        <DropdownMenuItem @click="mode = 'auto'"> System </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </span>
</template>
