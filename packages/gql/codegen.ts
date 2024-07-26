import type { CodegenConfig } from "@graphql-codegen/cli"
import { addTypenameSelectionDocumentTransform } from "@graphql-codegen/client-preset"
import dotenv from "dotenv"
import { parse, safeParse, string } from "valibot"

dotenv.config()

if (!process.env.SUPABASE_GRAPHQL_ENDPOINT) {
	console.error("SUPABASE_GRAPHQL_ENDPOINT is not set")
}
if (!process.env.SUPABASE_ANON_KEY) {
	console.error("SUPABASE_ANON_KEY is not set")
}

const endpoint = parse(
	string("SUPABASE_GRAPHQL_ENDPOINT Env Var"),
	process.env.SUPABASE_GRAPHQL_ENDPOINT
)
const schema: any = {}
schema[endpoint] = {
	headers: {
		apiKey: parse(string("SUPABASE_ANON_KEY Env Var"), process.env.SUPABASE_ANON_KEY)
	}
}
const config: CodegenConfig = {
	schema: schema,
	documents: "src/**/*.graphql",
	overwrite: true,
	ignoreNoDocuments: true,
	generates: {
		"src/gql/": {
			preset: "client",
			documentTransforms: [addTypenameSelectionDocumentTransform],
			plugins: [],
			config: {
				scalars: {
					UUID: "string",
					Date: "string",
					Time: "string",
					Datetime: "string",
					JSON: "string",
					BigInt: "string",
					BigFloat: "string",
					Opaque: "any"
				}
			}
		}
	},
	hooks: {
		// afterAllFileWrite: ["npm run prettier"], // optional
	}
}

export default config
