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
import { AppsExtension } from "@/lib/extension/apps";
import { SystemCommandExtension } from "@/lib/extension/systemCmds";
import { BuiltinCmds } from "@/lib/extension/builtin";
import type { IExtensionBase } from "@/lib/extension/base";
import { useStore } from "@nanostores/vue";
import { Extension } from "@/lib/extension/ext";
import { $appConfig } from "@/lib/stores/appConfig";
import { extensionsFolder } from "@/lib/constants";
import { $appListItems } from "@/lib/stores/apps";
import { $appState, setSearchTerm } from "@/lib/stores/appState";
import { RemoteExtension } from "@/lib/extension/remoteExt";

const appExt = new AppsExtension();
const sysCmdExt = new SystemCommandExtension();
const builtinCmdExt = new BuiltinCmds();
const devExt = new Extension("Dev Extensions", $appConfig.get().devExtentionPath, true);
const storeExt = new Extension("Extensions", extensionsFolder);
const remoteExt = new RemoteExtension();
const exts: IExtensionBase[] = [
  // devExt,
  remoteExt,
  storeExt,
  builtinCmdExt,
  sysCmdExt,
  // appExt
];

// const config = useRuntimeConfig();
// search input debouncing
const searchTermInSync = ref("");
let updateSearchTermTimeout: ReturnType<typeof setTimeout>;
watch(searchTermInSync, (val) => {
  clearTimeout(updateSearchTermTimeout);
  updateSearchTermTimeout = setTimeout(() => {
    setSearchTerm(val);
  }, 100);
});

onMounted(async () => {
  Promise.all(exts.map((ext) => ext.load()));
});
</script>
<template>
  <div class="h-full">
    <CmdPaletteCommand class="" v-model:searchTerm="searchTermInSync" :identity-filter="true">
      <CommandInput class="h-12 text-md" placeholder="Search for apps or commands..." />
      <CommandList class="h-full">
        <CommandEmpty>No results found.</CommandEmpty>
        <MainSearchListGroup v-for="ext in exts" :ext="ext" />
      </CommandList>
      <CmdPaletteFooter />
    </CmdPaletteCommand>
  </div>
</template>
