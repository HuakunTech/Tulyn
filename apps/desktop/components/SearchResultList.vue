<script setup lang="ts">
import { ListView, ListGroup, ListItem } from "@/components/interface/list";
import { apps, model, system } from "@jarvis/api";
import { computedAsync } from "@vueuse/core";
import { open } from "@tauri-apps/api/shell";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";
import { GlobalEventBus } from "~/lib/globalEvents";
import { Button } from "~/components/ui/button";
import { Icon } from "@iconify/vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
const filteredSysCommands = computed<model.list.TListItem[]>(() => {
  return system.systemCommandListItems.filter((cmd) =>
    cmd.title.toLowerCase().includes(appStore.searchTerm.toLowerCase()),
  );
});
const appStore = useAppsStore();
const foundApps = computedAsync<model.list.TListItem[]>(() => {
  return appStore.searchApps(appStore.searchTerm).then((res) => {
    return res.map((x) => apps.convertAppToTListItem(x));
  });
});

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
    <ListGroup heading="System Commands"> </ListGroup>
    <ListItem
      class="justify-between py-1"
      @select="
        () => {
          console.log('selected', cmd);
          const foundCmd = system.systemCommands.find((c) => c.value === cmd.value);
          if (foundCmd) {
            foundCmd.function();
          }
        }
      "
      v-for="cmd in filteredSysCommands"
      :key="cmd.value"
      :value="cmd.value"
    >
      <span class="flex items-center">
        <Button size="sm" variant="ghost" class="pointer-events-none">
          <Icon v-if="cmd.icon?.type === model.list.IconType.Enum.iconify" :icon="cmd.icon.value" class="w-5 h-5" />
        </Button>
        <span class="font-semibold text-sm">{{ cmd.title }}</span>
        <pre class="p-0 m-0 ml-4 text-sm">{{ cmd.description }}</pre>
      </span>
      <span class="pr-3 text-muted-foreground capitalize font-mono">{{ cmd.type }}</span>
    </ListItem>

    <ListGroup heading="Applications">
      <ListItem
        class="justify-between py-1"
        @select="
          () => {
            open(app.value);
          }
        "
        v-for="app in foundApps"
        :key="app.value"
        :value="app.value"
      >
        <!-- <span>{{ app.name }}</span> -->
        <span class="flex items-center">
          <Button size="sm" variant="ghost" class="pointer-events-none">
            <Icon v-if="app.icon?.type === model.list.IconType.Enum.iconify" :icon="app.icon.value" class="w-5 h-5" />
          </Button>
          <span class="font-semibold text-sm">{{ app.title }}</span>
          <pre v-if="app.description" class="p-0 m-0 ml-4 text-sm">{{ app.description }}</pre>
        </span>
        <span class="pr-3 text-muted-foreground capitalize font-mono">{{ app.type }}</span>
      </ListItem>
    </ListGroup>
  </ListView>
</template>
