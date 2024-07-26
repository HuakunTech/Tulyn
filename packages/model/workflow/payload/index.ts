import { z } from "zod"

export const TextPayloadSchema = z.object({
	type: z.literal("text"),
	value: z.array(z.string())
})
export const ListItemPayloadSchema = z.object({
	//   uid: z.string(),
	//   type: z.string(),
	title: z.string(),
	subtitle: z.string(),
	//   arg: z.string(),
	autocomplete: z.string()
	//   icon: z.object({
	//     type: z.string(),
	//     path: z.string(),
	//   }),
})
export const ListPayloadSchema = z.object({
	type: z.literal("list"),
	items: z.array(ListItemPayloadSchema)
})
