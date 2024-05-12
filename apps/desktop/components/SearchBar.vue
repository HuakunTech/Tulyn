<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";
import { useAppStore } from "~/stores/app";

const props = defineProps({
  autofocus: {
    type: Boolean,
    default: true,
  },
  class: {
    type: String,
    default: "",
  },
});
import { cn } from "@/lib/utils";
const appStore = useAppStore();
const searchTerm = computed({
  get() {
    return appStore.searchTerm;
  },
  set(val) {
    appStore.searchTerm = val;
  },
});
</script>
<template>
  <div :class="cn('relative w-full items-center border-b-2', props.class)">
    <Input
      :autofocus="props.autofocus"
      type="text"
      v-model="searchTerm"
      placeholder="Search for Apps and Commands"
      class="pl-10 border-none focus:border-transparent focus-visible:ring-0"
    />
    <span class="absolute inset-y-7 flex items-center justify-center px-2">
      <Search class="size-5 text-muted-foreground" />
    </span>
  </div>
</template>
