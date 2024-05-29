<script setup lang="ts">
import { CommandGroup } from "@/components/ui/command";
import ListItem from "@/components/MainSearch/list-item.vue";
import type { IExtensionBase } from "@/lib/extension/base";
import { $appState } from "@/lib/stores/appState";
import { useStore } from "@nanostores/vue";
import { computed } from "vue";
import type { TListItem } from "jarvis-api";

const appState = useStore($appState);
const props = defineProps<{ ext: IExtensionBase }>();
const listItems = useStore(props.ext.$listItems);
const showListItems = computed(() => {
  if (!appState.value.searchTerm) return props.ext.default();
  return listItems.value.filter((item) =>
    item.title.toLowerCase().includes(appState.value.searchTerm.toLowerCase()),
  );
});
</script>
<template>
  <CommandGroup :heading="ext.extensionName">
    <ListItem
      v-for="(item, idx) in showListItems"
      :item="item as TListItem"
      :key="`${ext.extensionName}-${idx}`"
      @select="ext.onSelect(item as TListItem)"
    />
  </CommandGroup>
</template>
