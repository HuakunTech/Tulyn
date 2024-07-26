import { z } from "zod"
import { BaseNode, FileType, NodeTypeInput, Position, SortBy } from "../common"

export const FileFilterName = z.literal("file_filter")

export const FileFilterNode = z
	.object({
		type: NodeTypeInput,
		name: FileFilterName,
		keyword: z.string(),
		workflowIcon: z.string(),
		title: z.string(),
		subtext: z.string(),
		searchScope: z.string().array(),
		filter: z.object({
			extension: z.string(),
			regex: z.string(),
			fileType: FileType
		}),
		limit: z.number(),
		sortBy: SortBy
	})
	.merge(BaseNode)
	.merge(Position)
