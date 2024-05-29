<script setup lang="ts">
import { onBeforeMount, onMounted, ref, computed, watch } from "vue";
import { AppsExtension } from "@/lib/extension/apps";
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
import { $appState, setSearchTerm } from "@/lib/stores/appState";
import ListItem from "./MainSearch/list-item.vue";
import ListGroup from "./MainSearch/list-group.vue";
import { TListItem } from "jarvis-api";
import { ElNotification } from "element-plus";
import { SystemCommandExtension } from "@/lib/extension/systemCmds";
import type { IExtensionBase } from "@/lib/extension/base";
import { useStore } from "@nanostores/vue";
import { DevExtension } from "@/lib/extension/ext";
import { $appConfig } from "@/lib/stores/appConfig";
import { extensionsFolder } from "@/lib/constants";
import { $appListItems } from "@/lib/stores/apps";

const appExt = new AppsExtension();
const sysCmdExt = new SystemCommandExtension();
const devExt = new DevExtension("Dev Extensions", $appConfig.get().devExtentionPath, true);
const storeExt = new DevExtension("Extensions", extensionsFolder);
const exts: IExtensionBase[] = [storeExt, devExt, sysCmdExt, appExt];

// search input debouncing
const searchTermInSync = ref("");
let updateSearchTermTimeout: ReturnType<typeof setTimeout>;
watch(searchTermInSync, (val) => {
  clearTimeout(updateSearchTermTimeout);
  updateSearchTermTimeout = setTimeout(() => {
    setSearchTerm(val);
  }, 200);
});

onMounted(async () => {
  Promise.all(exts.map((ext) => ext.load()));
});
</script>
<template>
  <Command class="" v-model:searchTerm="searchTermInSync" :identity-filter="true">
    <CommandInput placeholder="Search for apps or commands..." :always-focus="true" />
    <CommandList class="px-2">
      <CommandEmpty>No results found.</CommandEmpty>
      <ListGroup v-for="ext in exts" :ext="ext" />
    </CommandList>
  </Command>
</template>
