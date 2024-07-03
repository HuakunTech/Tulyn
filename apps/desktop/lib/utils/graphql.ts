import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { SUPABASE_ANON_KEY, SUPABASE_GRAPHQL_ENDPOINT } from "../constants"

export const gqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: SUPABASE_GRAPHQL_ENDPOINT,
    headers: {
      apiKey: SUPABASE_ANON_KEY
    }
  })
})
