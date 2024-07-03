<script setup lang="ts">
import { CommandGroup, CommandItem } from "@/components/ui/command";
import ListItem from "@/components/MainSearch/list-item.vue";
import type { IExtensionBase } from "@/lib/extension/base";
import { $appState } from "@/lib/stores/appState";
import { useStore } from "@nanostores/vue";
import { computed } from "vue";
import type { TListItem } from "jarvis-api/models";
import { extractRuntimeEmits } from "vue/compiler-sfc";

const appState = useStore($appState);
const props = defineProps<{ ext: IExtensionBase }>();
const listItems = useStore(props.ext.$listItems);

const showListItems = computed(() => {
  if (!appState.value.searchTerm || appState.value.searchTerm.length < 3)
    return listItems.value?.slice(0, 10);
  return listItems.value.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(appState.value.searchTerm.toLowerCase());
    const keywordMatch = item.keywords
      .map((keyword) => keyword.toLowerCase().includes(appState.value.searchTerm.toLowerCase()))
      .some((x) => x);
    return [titleMatch, keywordMatch].some((x) => x);
  });
});
</script>
<template>
  <CommandGroup :heading="ext.extensionName">
    <ListItem
      v-for="(item, idx) in showListItems"
      :item="item as TListItem"
      :isDevExt="ext.extensionName === 'Dev Extensions'"
      :key="`${ext.extensionName}-${idx}`"
      @select="ext.onSelect(item as TListItem)"
    />
  </CommandGroup>
</template>
