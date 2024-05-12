<script setup lang="ts">
import { apps, model } from "@jarvis/api";
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

onMounted(async () => {
  appStore.fetchApps();
});
</script>
<template>
  <NuxtLayout>
    <div class="h-full">
      <div class="h-full flex flex-col">
        <SearchBar />
        <div class="grow overflow-y-scroll">
          <AppList class="overflow-y-scroll" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
