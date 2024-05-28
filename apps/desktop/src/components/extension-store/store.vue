<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
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
import Command from "./Command.vue";
import { ExtItem, ExtItemParser } from "./types";
import { $extensionsStore } from "@/lib/stores/extensions";
import { useStore } from "@nanostores/vue";
import { computed } from "nanostores";
import { gqlClient } from "@/lib/utils/graphql";

const extIdentifiersSet = computed($extensionsStore, (state) => {
  return new Set(state.manifests.map((ext) => ext.jarvis.identifier));
});
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

  selectedExt.value = extList.value[0];
  extDrawerOpen.value = true;
});

function select(item: ExtItem) {
  console.log(item);
  selectedExt.value = item;
  extDrawerOpen.value = true;
}
</script>
<template>
  <ExtDrawer v-model:open="extDrawerOpen" :selectedExt="selectedExt" />
  <Command>
    <CommandInput placeholder="Type to search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Extensions">
        <ExtListItem
          v-for="item in extList"
          :data="item"
          :installed="extIdentifiersSet.value?.has(item.identifier) ?? false"
          @select="select(item)"
        />
      </CommandGroup>
    </CommandList>
  </Command>
</template>
