<script setup lang="ts">
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import ListItem from "@/components/MainSearch/list-item.vue";
import type { ExtensionBase } from "@/lib/extension/base";
import { $appState } from "@/lib/stores/appState";
import { useStore } from "@nanostores/vue";
import { computed } from "vue";
import { computed as nanoComputed } from "nanostores";

const appState = useStore($appState);

const props = defineProps<{ ext: ExtensionBase }>();
</script>
<template>
  <CommandGroup :heading="ext.extensionName">
    <ListItem
      v-for="(app, idx) in ext.search(appState.searchTerm)"
      :item="app"
      :key="`${ext.extensionName}-${idx}`"
      @select="ext.onSelect(app)"
    />
  </CommandGroup>
</template>
