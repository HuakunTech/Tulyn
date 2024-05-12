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
    <SearchBar />
    <div class="grow overflow-y-auto track-gray-100">
      <AppList class="track-gray-100" />
    </div>
  </NuxtLayout>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 0.8rem;
}

::-webkit-scrollbar-track {
  background: none;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
}
</style>
