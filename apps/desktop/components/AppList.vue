<script setup lang="ts">
import { ListView, ListGroup, ListItem } from "@/components/interface/list";
import { apps, model } from "@jarvis/api";
import { computedAsync } from "@vueuse/core";
import { open } from "@tauri-apps/api/shell";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
const appStore = useAppStore();
const foundApps = computedAsync<model.apps.AppInfo[]>(() => {
  return appStore.searchApps(appStore.searchTerm);
}, []);
</script>

<template>
  <ListView :class="cn(props.class)">
    <ListGroup heading="Applications">
      <ListItem
        @select="
          () => {
            open(app.app_desktop_path);
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
