import { toJSONSchema } from "@gcornut/valibot-json-schema"
import { array, literal, object, string, union } from "valibot"

const ClipboardPermissionSchema = union([
	literal("clipboard:read-all"),
	literal("clipboard:write-all"),
	literal("clipboard:read-text"),
	literal("clipboard:write-text"),
	literal("clipboard:read-image"),
	literal("clipboard:write-image"),
	literal("clipboard:read-files"),
	literal("clipboard:write-files")
])

const ManifestSchema = object({
	name: string(),
	version: string(),
	description: string(),
	permissions: array(ClipboardPermissionSchema)
})

// @ts-ignore
console.log(toJSONSchema({ schema: ManifestSchema }))
