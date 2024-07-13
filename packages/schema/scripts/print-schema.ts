// import {
//   GetObjectCommand,
//   ListBucketsCommand,
//   PutObjectCommand,
//   S3Client
// } from "@aws-sdk/client-s3"
// import { zodToJsonSchema } from "zod-to-json-schema"
// import { ExtPackageJson } from "../src/manifest"

// const jsonSchema = zodToJsonSchema(ExtPackageJson, {})
// // @ts-ignore
// jsonSchema["additionalProperties"] = true
// const schemaStr = JSON.stringify(jsonSchema, null, 2)
// console.log(schemaStr)

import { toJSONSchema } from "@gcornut/valibot-json-schema"
import { ExtPackageJson } from "../src/manifest"
import { getJsonSchema } from "../src/utils"

// @ts-ignore
console.log(getJsonSchema(ExtPackageJson))
