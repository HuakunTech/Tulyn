<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { extensionsFolder, SUPABASE_ANON_KEY, SUPABASE_GRAPHQL_ENDPOINT } from "@/lib/constants";
import { ApolloClient, InMemoryCache, HttpLink, type ApolloQueryResult, gql } from "@apollo/client";
import { type AllExtensionsQuery, AllExtensionsDocument } from "@jarvis/gql";
import ExtListItem from "./ext-list-item.vue";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import ExtDrawer from "./ExtDrawer.vue";
import { Button } from "@/components/ui/button";
import Command from "./Command.vue";
import { ExtItem, ExtItemParser } from "./types";
// import { $extensionsStore, loadAllExtensionsManifest } from "@/lib/stores/extensions";
import { Extension } from "@/lib/extension/ext";
import { gqlClient } from "@/lib/utils/graphql";
import { ElMessage } from "element-plus";
import { $appConfig } from "@/lib/stores/appConfig";
import type { ExtPackageJsonExtra } from "jarvis-api";
import { type Tables } from "@jarvis/supabase";

const ext = new Extension("Extensions", extensionsFolder);
const selectedExt = ref<ExtItem>();
const extDrawerOpen = ref(false);
const extList = ref<ExtItem[]>([]);
const installedManifests = ref<ExtPackageJsonExtra[]>([]);

function refreshListing() {
  return ext.load().then(() => {
    installedManifests.value = ext.manifests;
  });
}

onMounted(async () => {
  refreshListing();
  const response: ApolloQueryResult<AllExtensionsQuery> = await gqlClient.query({
    query: AllExtensionsDocument,
  });
  extList.value =
    response.data.extensionsCollection?.edges.map((x) =>
      ExtItem.parse(ExtItemParser.parse(x.node)),
    ) ?? [];
});

function select(item: ExtItem) {
  selectedExt.value = item;
  extDrawerOpen.value = true;
}

function isInstalled(identifier: string) {
  return !!installedManifests.value.find((x) => x.jarvis.identifier === identifier);
}

function onInstalled() {
  refreshListing();
}

function uninstall(extPublish: Tables<"ext_publish"> | null) {
  if (extPublish) {
    ext.uninstallExt(extPublish.identifier).then((manifest) => {
      ElMessage.success(`Uninstalled: ${manifest.name}`);
      extDrawerOpen.value = false;
      refreshListing();
    });
  } else {
    ElMessage.error("No Extension Selected");
  }
}
</script>
<template>
  <ExtDrawer
    v-model:open="extDrawerOpen"
    :selectedExt="selectedExt"
    :installed="selectedExt?.identifier ? isInstalled(selectedExt?.identifier) : false"
    @installed="onInstalled"
    @uninstall="uninstall"
  />
  <Command>
    <CommandInput placeholder="Type to search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Extensions">
        <ExtListItem
          v-for="item in extList"
          :data="item"
          :installed="isInstalled(item.identifier)"
          @select="select(item)"
        />
      </CommandGroup>
    </CommandList>
  </Command>
</template>
