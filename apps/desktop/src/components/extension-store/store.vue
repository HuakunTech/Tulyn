<script setup lang="ts">
import { onMounted } from "vue";
import { SUPABASE_ANON_KEY, SUPABASE_GRAPHQL_ENDPOINT } from "@/lib/constants";
import { ApolloClient, InMemoryCache, HttpLink, type ApolloQueryResult } from "@apollo/client";
import { type AllExtensionsQuery, AllExtensionsDocument } from "@jarvis/gql";

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

  console.log(response.data.extensionsCollection?.edges);
});
</script>
<template></template>
