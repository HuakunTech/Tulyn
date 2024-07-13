import { type Database } from "@jarvis/supabase"
import { createClient } from "@supabase/supabase-js"
import { parse, string } from "valibot"
import { ExtPackageJson } from "../src/manifest"

const supabase = createClient<Database>(
  parse(string(), process.env.SUPABASE_URL),
  parse(string(), process.env.SUPABASE_SERVICE_ROLE_KEY)
)

// const jsonSchema = zodToJsonSchema(ExtPackageJson, {})
// @ts-ignore
// jsonSchema["additionalProperties"] = true
// const schemaStr = JSON.stringify(jsonSchema, null, 2)
const schemaStr = getJsonSchema(ExtPackageJson)

const { data, error } = await supabase.storage.from("extensions").upload("schema.json", schemaStr, {
  cacheControl: "3600",
  upsert: true // overwrite existing file with same name
})
await supabase.storage.from("extensions").upload("nightly.schema.json", schemaStr, {
  cacheControl: "3600",
  upsert: true // overwrite existing file with same name
})
console.log("data", data)
if (error) {
  console.error("Failed to upload schema.json")
  console.error(error)
  process.exit(1)
}
