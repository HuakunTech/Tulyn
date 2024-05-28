<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { humanReadableNumber } from "@/lib/utils/format";
import { CircleCheckBigIcon } from "lucide-vue-next";
import { CommandItem } from "@/components/ui/command";
import { ExtItem } from "./types";

const props = defineProps<{
  value: string;
  data: ExtItem;
}>();
</script>
<template>
  <CommandItem :value="props.value" class="border">
    <div class="flex justify-between items-center w-full">
      <div class="flex items-center space-x-2">
        <Icon :icon="props.data.icon.icon" />
        <div>
          <div class="text-xs text-muted-foreground font-mono">{{ props.data.name }}</div>
          <div>{{ props.data.description }}</div>
        </div>
      </div>
      <div class="flex space-x-4">
        <CircleCheckBigIcon class="w-4 text-green-400" />
        <div class="flex items-center space-x-1">
          <Icon icon="ic:round-download" class="w-5 h-5 inline" />
          <span class="w-8 text-center">{{ humanReadableNumber(props.data.downloads) }}</span>
        </div>
      </div>
    </div>
  </CommandItem>
</template>
