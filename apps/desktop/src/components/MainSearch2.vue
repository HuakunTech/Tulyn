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
import {
  AlertDialogControlled,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { $appState, setSearchTerm } from "@/lib/stores/appState";
import ListItem from "./MainSearch/list-item.vue";
import ListGroup from "./MainSearch/list-group.vue";
import { TListItem } from "jarvis-api";
import { ElNotification } from "element-plus";
import { SystemCommandExtension } from "@/lib/extension/systemCmds";
import type { ExtensionBase } from "@/lib/extension/base";
import { useStore } from "@nanostores/vue";

const appExt = new AppsExtension();
const sysCmdExt = new SystemCommandExtension();
const exts: ExtensionBase[] = [sysCmdExt, appExt];
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
  <Command class="" v-model:searchTerm="searchTermInSync" :identity-filter="false">
    <CommandInput placeholder="Search for apps or commands..." :always-focus="true" />
    <CommandList class="px-2">
      <CommandEmpty>No results found.</CommandEmpty>
      <ListGroup v-for="ext in exts" :ext="ext" />
    </CommandList>
  </Command>
</template>
