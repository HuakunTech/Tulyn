<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";
import { useAppStore } from "~/stores/app";

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
  <div class="relative w-full items-center border-b-2">
    <Input
      type="text"
      v-model="searchTerm"
      placeholder="Search for Apps and Commands"
      class="pl-10 border-none focus:border-transparent focus-visible:ring-0"
    />
    <span
      class="absolute inset-y-7 flex items-center justify-center px-2"
    >
      <Search class="size-6 text-muted-foreground" />
    </span>
  </div>
</template>
