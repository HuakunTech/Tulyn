import { z } from "zod"

export const BaseNode = z.object({ name: z.any(), uuid: z.string().uuid() })
export const Position = z.object({ x: z.number(), y: z.number() })
// This GeneralDefault can be used anywhere to indicate: a default value or behavior will be used
export const GeneralDefault = z.literal("default")
export const uuid = z.string().uuid()
export const FileType = z.enum(["file", "dir", "both"])
export const SortBy = z.enum(["creation_time", "modified_time", "default"])
// argument
export const ArgumentRequired = z.literal("required")
export const ArgumentOptional = z.literal("optional")
export const ArgumentNone = z.literal("none")
export const ArgumentType = z.enum([
	ArgumentRequired.value,
	ArgumentOptional.value,
	ArgumentNone.value
])
// node types
export const NodeTypeEvent = z.literal("event")
export const NodeTypeInput = z.literal("input")
export const NodeTypeAction = z.literal("action")
export const NodeType = z.enum([NodeTypeEvent.value, NodeTypeInput.value, NodeTypeAction.value])
