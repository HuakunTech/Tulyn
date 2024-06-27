import type { CodegenConfig } from "@graphql-codegen/cli";
import { addTypenameSelectionDocumentTransform } from "@graphql-codegen/client-preset";
import { z } from "zod";

const endpoint = z
  .string()
  .describe("SUPABASE_GRAPHQL_ENDPOINT Env Var")
  .parse(process.env.SUPABASE_GRAPHQL_ENDPOINT);
const schema: any = {};
schema[endpoint] = {
  headers: {
    apiKey: z.string().describe("SUPABASE_ANON_KEY Env Var").parse(process.env.SUPABASE_ANON_KEY),
  },
};
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
          Opaque: "any",
        },
      },
    },
  },
  hooks: {
    // afterAllFileWrite: ["npm run prettier"], // optional
  },
};

export default config;
