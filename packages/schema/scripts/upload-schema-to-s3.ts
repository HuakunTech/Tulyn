import {
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3"
import { toJSONSchema } from "@gcornut/valibot-json-schema"
import * as v from "valibot"
import { zodToJsonSchema } from "zod-to-json-schema"
import { ExtPackageJson } from "../src/manifest"
import { getJsonSchema } from "../src/utils"

const s3Client = new S3Client({
  endpoint: v.parse(v.string(), process.env.S3_ENDPOINT),
  region: "auto",
  credentials: {
    accessKeyId: v.parse(v.string(), process.env.S3_ACCESS_KEY_ID),
    secretAccessKey: v.parse(v.string(), process.env.S3_SECRET_ACCESS_KEY)
  }
})
/* -------------------------------------------------------------------------- */
/*                                 Get Schema                                 */
/* -------------------------------------------------------------------------- */
// const { Body } = await s3Client.send(
//   new GetObjectCommand({
//     Bucket: "jarvis-extensions",
//     Key: "schema.json",
//   }),
// );
// const data = await Body?.transformToByteArray();
// if (data) {
//     fs.writeFileSync("schema.json", data);
// }

/* -------------------------------------------------------------------------- */
/*                             Upload Schema to S3                            */
/* -------------------------------------------------------------------------- */

const schemaStr = getJsonSchema(ExtPackageJson)
// const jsonSchema = zodToJsonSchema(ExtPackageJson, {})
// @ts-ignore
// jsonSchema["additionalProperties"] = true
// const schemaStr = JSON.stringify(jsonSchema, null, 2)

await s3Client.send(
  new PutObjectCommand({
    Bucket: "jarvis-extensions",
    Key: "nightly.schema.json",
    Body: schemaStr,
    ContentType: "application/json"
  })
)

s3Client
  .send(
    new PutObjectCommand({
      Bucket: "jarvis-extensions",
      Key: "schema.json",
      Body: schemaStr,
      ContentType: "application/json"
    })
  )
  .then(() => {
    console.log("Schema uploaded to S3")
  })
  .catch((err) => {
    console.error("Failed to upload schema.json")
    console.error(err)
    process.exit(1)
  })
