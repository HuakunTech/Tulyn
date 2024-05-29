<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import type { TListItem } from "jarvis-api";

const props = defineProps<{ item: TListItem }>();
const emits = defineEmits<{
  (e: "select"): void;
}>();
</script>

<template>
  <CommandItem @select="() => emits('select')" :value="item.value">
    <img
      width="20"
      class="mr-2"
      v-if="item.icon?.type === 'remote-url'"
      :src="item.icon?.value"
      alt=""
    />
    <Icon v-else-if="item.icon?.type === 'iconify'" :icon="item.icon.value" class="w-5 h-5 mr-2" />
    <Icon v-else icon="mingcute:appstore-fill" class="w-5 h-5 mr-2" />
    <span>{{ item.title }}</span>
    <CommandShortcut class="space-x-3">
      <Icon v-if="item.isDev" icon="ph:dev-to-logo-fill" class="inline w-5 h-6 text-green-500" />
      <span>{{ item.type }}</span>
    </CommandShortcut>
  </CommandItem>
</template>
