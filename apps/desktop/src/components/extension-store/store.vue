<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";
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
import Command from "./Command.vue";
import { ExtItem } from "./types";
import { $extensionsStore } from "@/lib/stores/extensions";
import { useStore } from "@nanostores/vue";
import { computed } from "nanostores";

const extIdentifiersSet = computed($extensionsStore, (state) => {
  return new Set(state.manifests.map((ext) => ext.jarvis.identifier));
});

const extList = ref<ExtItem[]>([]);
onMounted(async () => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: SUPABASE_GRAPHQL_ENDPOINT,
      headers: {
        apiKey: SUPABASE_ANON_KEY,
      },
    }),
  });

  const response: ApolloQueryResult<AllExtensionsQuery> = await client.query({
    query: AllExtensionsDocument,
  });
  extList.value = response.data.extensionsCollection?.edges.map((x) => ExtItem.parse(x.node)) ?? [];
});

function select(item: ExtItem) {
  console.log(item);
}
</script>
<template>
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
