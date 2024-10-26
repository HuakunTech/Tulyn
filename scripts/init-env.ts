// write SUPABASE_ANON_KEY env to .env
import { writeFileSync } from "fs"
import { resolve } from "path"

const defaultEnvUrl = `https://storage.kunkun.sh/env.json`
const res = await fetch(defaultEnvUrl)
const env = await res.json()

let envContent = ""

if (!process.env.SUPABASE_ANON_KEY) {
	process.env.SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY
}
if (!process.env.SUPABASE_PROJECT_ID) {
	process.env.SUPABASE_PROJECT_ID = env.SUPABASE_PROJECT_ID
}

if (process.env.SUPABASE_ANON_KEY) {
	envContent += `SUPABASE_ANON_KEY=${process.env.SUPABASE_ANON_KEY}\n`
}
if (process.env.SUPABASE_PROJECT_ID) {
	const supabaseUrl = `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`
	const supabaseGraphqlEndpoint = `${supabaseUrl}/graphql/v1`
	envContent += `
SUPABASE_GRAPHQL_ENDPOINT=${supabaseGraphqlEndpoint}
SUPABASE_URL=${supabaseUrl}
`
}
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
	envContent += `\nSUPABASE_SERVICE_ROLE_KEY=${process.env.SUPABASE_SERVICE_ROLE_KEY}\n`
}
if (process.env.POSTHOG_PUBLIC_KEY && process.env.POSTHOG_HOST) {
	envContent += `
POSTHOG_PUBLIC_KEY=${process.env.POSTHOG_PUBLIC_KEY}
POSTHOG_HOST=${process.env.POSTHOG_HOST}
`
}
console.log(".env files written")
console.log(envContent)

writeFileSync(resolve(__dirname, "../apps/desktop/.env"), envContent)
writeFileSync(resolve(__dirname, "../packages/gql/.env"), envContent)
writeFileSync(resolve(__dirname, "../packages/schema/.env"), envContent)
