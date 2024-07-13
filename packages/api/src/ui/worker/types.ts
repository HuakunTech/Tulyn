import {
  array,
  boolean,
  literal,
  nullable,
  object,
  optional,
  string,
  union,
  type InferOutput
} from "valibot"

export const IconType = union([literal("iconify"), literal("asset"), literal("remote-url")])
export type IconType = InferOutput<typeof IconType>

export const IconSchema = object({
  value: string(),
  type: IconType
})

export const ListItem = object({
  title: string(),
  value: string(),
  description: string(),
  icon: optional(IconSchema),
  shortcut: optional(string())
})
export type ListItem = InferOutput<typeof ListItem>
