import {
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3"
import { ExtPackageJson } from "jarvis-api/models"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

const jsonSchema = zodToJsonSchema(ExtPackageJson, {})
// @ts-ignore
jsonSchema["additionalProperties"] = true
const schemaStr = JSON.stringify(jsonSchema, null, 2)
console.log(schemaStr)
