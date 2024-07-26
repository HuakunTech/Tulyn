import { z } from "zod"
import { BaseNode, GeneralDefault, NodeTypeAction, Position } from "../common"

export const OpenURLName = z.literal("open_url")

/**
 * Open a url with given app.
 * Input field can be a hard coded path or by default (if set to GeneralDefault) it will be the output from previous node.
 * If app is GeneralDefault, it will open the url in default browser, otherwise will open url in the specified app
 */
export const OpenUrlNode = z
	.object({
		type: NodeTypeAction,
		input: z.string().or(GeneralDefault),
		app: z.string().or(GeneralDefault).default(GeneralDefault.value)
	})
	.merge(BaseNode)
	.merge(Position)
