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
const allApps = ref<model.apps.AppInfo[]>([]);

const foundApps = computed<model.apps.AppInfo[]>(() => {
  return allApps.value.filter((app: model.apps.AppInfo) => {
    const appName = app.name.toLowerCase().trim();
    const searchValue = searchTerm.value.toLowerCase().trim();
    const match = appName.includes(searchValue);
    // if (app.name === "iTerm2") {
    console.log(appName, searchValue, match);
    // }
    return match;
  });
});

onMounted(async () => {
  allApps.value = await await apps.getAllApps();
});
</script>
<template>
  <NuxtLayout>
    <SearchBar />
  </NuxtLayout>
</template>
