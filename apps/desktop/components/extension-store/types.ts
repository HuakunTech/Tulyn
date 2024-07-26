import { Icon } from "@kksh/api/models"
import { number, object, pipe, string, transform, type InferOutput } from "valibot"

export const ExtItemParser = object({
	identifier: string(),
	name: string(),
	downloads: number(),
	short_description: string(),
	long_description: string(),
	icon: pipe(
		string(),
		transform((val) => JSON.parse(val))
	)
})

export const ExtItem = object({
	...ExtItemParser.entries,
	...object({ icon: Icon }).entries
})

export type ExtItem = InferOutput<typeof ExtItem>
