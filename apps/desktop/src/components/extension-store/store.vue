<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";
import { SUPABASE_ANON_KEY, SUPABASE_GRAPHQL_ENDPOINT } from "@/lib/constants";
import { ApolloClient, InMemoryCache, HttpLink, type ApolloQueryResult } from "@apollo/client";
import { type AllExtensionsQuery, AllExtensionsDocument } from "@jarvis/gql";
import ExtListItem from "./ext-list-item.vue";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { ExtItem } from "./types";

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
  console.log(response.data.extensionsCollection?.edges);
});
</script>
<template>
  <Command>
    <CommandInput placeholder="Type to search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Extensions">
        <ExtListItem
          v-for="item in extList"
          :value="`${item.identifier}@${item.version}`"
          :data="item"
        />
        <!-- <CommandItem v-for="item in extList" :value="`${item.identifier}@${item.version}`">
          <div class="flex justify-between items-center w-full">
            <div class="">
              <span>{{ item.name }}</span>
            </div>
            <div class="flex space-x-4">
              <CircleCheckBigIcon class="w-4 text-green-400" />
              <div class="flex items-center space-x-1">
                <Icon icon="ic:round-download" class="w-5 h-5 inline" />
                <span>TODO</span>
              </div>
              <div class="flex items-center space-x-1">
                <Icon icon="ph:command-bold" class="w-5 h-5 inline" />
                <span>TODO</span>
              </div>
            </div>
          </div>
        </CommandItem> -->
      </CommandGroup>
      <!-- <CommandSeparator /> -->
    </CommandList>
  </Command>
</template>
