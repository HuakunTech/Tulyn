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
import { ElNotification } from "element-plus";
import { SystemCommandExtension } from "@/lib/extension/systemCmds";
import { BuiltinCmds } from "@/lib/extension/builtin";
import type { IExtensionBase } from "@/lib/extension/base";
import { useStore } from "@nanostores/vue";
import { Extension } from "@/lib/extension/ext";
import { $appConfig } from "@/lib/stores/appConfig";
import { extensionsFolder } from "@/lib/constants";
import { $appListItems } from "@/lib/stores/apps";
import { RemoteExtension } from "@/lib/extension/remoteExt";

const appExt = new AppsExtension();
const sysCmdExt = new SystemCommandExtension();
const builtinCmdExt = new BuiltinCmds();
const devExt = new Extension("Dev Extensions", $appConfig.get().devExtentionPath, true);
const storeExt = new Extension("Extensions", extensionsFolder);
const remoteExt = new RemoteExtension();
const exts: IExtensionBase[] = [devExt, remoteExt, storeExt, builtinCmdExt, sysCmdExt, appExt];

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
