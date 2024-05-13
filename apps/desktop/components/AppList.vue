<script setup lang="ts">
import { ListView, ListGroup, ListItem } from "@/components/interface/list";
import { apps, model } from "@jarvis/api";
import { computedAsync } from "@vueuse/core";
import { open } from "@tauri-apps/api/shell";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";
import { GlobalEventBus } from "~/lib/globalEvents";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
const appStore = useAppsStore();
const foundApps = computedAsync<model.apps.AppInfo[]>(() => {
  return appStore.searchApps(appStore.searchTerm);
  return [];
}, []);

GlobalEventBus.onSearchBarKeyDown((e) => {
  // console.log("pressed", e.key);
});
const selected = ref("");
// watch(foundApps, () => {
//   selected.value = foundApps.value[0]?.app_desktop_path ?? "";
// });
</script>

<template>
  <ListView :class="cn(props.class)" v-model="selected">
    <ListGroup heading="Applications">
      <ListItem
        @select="
          () => {
            // open(app.app_desktop_path);
          }
        "
        v-for="app in foundApps"
        :key="app.app_desktop_path"
        :value="app.app_desktop_path"
      >
        <span>{{ app.name }}</span>
      </ListItem>
    </ListGroup>
  </ListView>
</template>
