import { z } from "zod"
import {
  S3Client,
  ListBucketsCommand,
  GetObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3"
import { zodToJsonSchema } from "zod-to-json-schema"
import { ExtPackageJson } from "jarvis-api/models"

const jsonSchema = zodToJsonSchema(ExtPackageJson, {})
// @ts-ignore
jsonSchema["additionalProperties"] = true
const schemaStr = JSON.stringify(jsonSchema, null, 2)
console.log(schemaStr)
