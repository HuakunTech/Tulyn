import { zodToJsonSchema } from "zod-to-json-schema";
import { ExtPackageJson } from "../src/model";

const jsonSchema = zodToJsonSchema(ExtPackageJson, {});
// @ts-ignore
jsonSchema["additionalProperties"] = true;
console.log(JSON.stringify(jsonSchema, null, 2));
