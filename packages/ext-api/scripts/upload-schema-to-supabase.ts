import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { type Database } from "../supabase/types/supabase";

import { zodToJsonSchema } from "zod-to-json-schema";
import { ExtPackageJson } from "jarvis-api";

const supabase = createClient<Database>(
  z.string().parse(process.env.SUPABASE_URL),
  z.string().parse(process.env.SUPABASE_SERVICE_ROLE_KEY),
);

const jsonSchema = zodToJsonSchema(ExtPackageJson, {});
// @ts-ignore
jsonSchema["additionalProperties"] = true;
const schemaStr = JSON.stringify(jsonSchema, null, 2);

const { data, error } = await supabase.storage.from("extensions").upload("schema.json", schemaStr, {
  cacheControl: "3600",
  upsert: false,
});
console.log(data);
if (error) {
  console.error("Failed to upload schema.json");
  console.error(error);
  process.exit(1);
}
