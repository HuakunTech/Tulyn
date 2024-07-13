import { literal, union, type InferOutput } from "valibot"

export const SystemPermissionSchema = union([
  literal("system:volumn"),
  literal("system:boot"),
  literal("system:disk"),
  literal("system:apps"),
  literal("system:fs"),
  literal("system:ui")
])
export type SystemPermission = InferOutput<typeof SystemPermissionSchema>
