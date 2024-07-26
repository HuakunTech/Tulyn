import { z } from "zod"
import { ArgumentType, BaseNode, NodeTypeInput, Position } from "../common"

export const KeywordTriggerName = z.literal("keyword_trigger")

/**
 * A node that triggers the workflow when the user types a keyword.
 * Argument can be none, required or optional, and will be passed to the next node.
 */
export const KeywordTriggerNode = z
	.object({
		type: NodeTypeInput,
		name: KeywordTriggerName,
		argType: ArgumentType,
		keyword: z.string(),
		workflowIcon: z.string(),
		title: z.string(),
		subtext: z.string()
	})
	.merge(BaseNode)
	.merge(Position)
