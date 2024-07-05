import { ApolloClient, HttpLink, InMemoryCache, type ApolloQueryResult } from "@apollo/client"
import { z } from "zod"
import { AllExtensionsDocument, type AllExtensionsQuery } from "./index"

const endpoint = z.string().parse(process.env.SUPABASE_GRAPHQL_ENDPOINT)
const apiKey = z.string().parse(process.env.SUPABASE_ANON_KEY)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: endpoint,
    headers: {
      apiKey
    }
  })
})

const response: ApolloQueryResult<AllExtensionsQuery> = await client.query({
  query: AllExtensionsDocument
})

console.log(response.data.extensionsCollection?.edges)
