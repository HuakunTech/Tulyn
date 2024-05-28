<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { SUPABASE_ANON_KEY, SUPABASE_GRAPHQL_ENDPOINT } from "@/lib/constants";
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
import { $extensionsStore, loadAllExtensionsManifest } from "@/lib/stores/extensions";
import { gqlClient } from "@/lib/utils/graphql";
import { ElMessage } from "element-plus";

const selectedExt = ref<ExtItem>();
const extDrawerOpen = ref(false);
const extList = ref<ExtItem[]>([]);
onMounted(async () => {
  const response: ApolloQueryResult<AllExtensionsQuery> = await gqlClient.query({
    query: AllExtensionsDocument,
  });
  extList.value =
    response.data.extensionsCollection?.edges.map((x) =>
      ExtItem.parse(ExtItemParser.parse(x.node)),
    ) ?? [];
});

function select(item: ExtItem) {
  console.log(item);
  selectedExt.value = item;
  extDrawerOpen.value = true;
}

function isInstalled(identifier: string) {
  return !!$extensionsStore.value?.manifests.find((x) => x.jarvis.identifier === identifier);
}

function message() {
  ElMessage({
    message: "Congrats, this is a success message.",
    type: "success",
  });
}
</script>
<template>
  <ExtDrawer
    v-model:open="extDrawerOpen"
    :selectedExt="selectedExt"
    :installed="selectedExt?.identifier ? isInstalled(selectedExt?.identifier) : false"
  />
  <Button @click="message">Msg</Button>
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
