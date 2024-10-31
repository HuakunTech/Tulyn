import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_PROJECT_ID } from "$env/static/public"

export const SUPABASE_ANON_KEY = PUBLIC_SUPABASE_ANON_KEY
export const SUPABASE_URL = `https://${PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`
export const SUPABASE_GRAPHQL_ENDPOINT = `${SUPABASE_URL}/graphql/v1`
