<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { CircleCheckBigIcon } from "lucide-vue-next";
import { CommandItem } from "@/components/ui/command";
import { ExtItem } from "./types";

const props = defineProps<{
  value: string;
  data: ExtItem;
}>();
</script>
<template>
  <CommandItem :value="props.value">
    <div class="flex justify-between items-center w-full">
      <div class="">
        <span>{{ props.data.name }}</span>
      </div>
      <div class="flex space-x-4">
        <CircleCheckBigIcon class="w-4 text-green-400" />
        <div class="flex items-center space-x-1">
          <Icon icon="ic:round-download" class="w-5 h-5 inline" />
          <span>TODO</span>
        </div>
        <div class="flex items-center space-x-1">
          <Icon icon="ph:command-bold" class="w-5 h-5 inline" />
          <span>TODO</span>
        </div>
      </div>
    </div>
  </CommandItem>
</template>
