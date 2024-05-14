<script setup lang="ts">
import { apps, model } from "@jarvis/api";

const appStore = useAppsStore();

onMounted(async () => {
  await apps.refreshApplicationsList();
  appStore.fetchApps();
});
</script>
<template>
  <!-- <SearchBar @downpressed="() => console.log('pressed')" /> -->
  <!-- <div class="grow overflow-y-auto track-gray-100"> -->
  <!-- <AppList class="track-gray-100" /> -->
  <!-- <SearchResultList /> -->
  <!-- <DraftList class="w-full" /> -->
  <!-- <VForRef /> -->
  <!-- </div> -->
  <NuxtLayout>
    <MainSearch />
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
