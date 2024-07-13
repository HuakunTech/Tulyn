import { toJSONSchema } from "@gcornut/valibot-json-schema"
import * as v from "valibot"

const ClipboardPermissionSchema = v.union([
  v.literal("clipboard:read-all"),
  v.literal("clipboard:write-all"),
  v.literal("clipboard:read-text"),
  v.literal("clipboard:write-text"),
  v.literal("clipboard:read-image"),
  v.literal("clipboard:write-image"),
  v.literal("clipboard:read-files"),
  v.literal("clipboard:write-files")
])

const ManifestSchema = v.object({
  name: v.string(),
  version: v.string(),
  description: v.string(),
  permissions: v.array(ClipboardPermissionSchema)
})

console.log(toJSONSchema({ schema: ManifestSchema }))
