import { z } from "zod"
import { uuid } from "./common"
import { FileFilterName, FileFilterNode } from "./inputs/file-filter"
import { OpenFileNode, OpenFileName } from "./actions/open-file"
import { ScriptFilterName, ScriptFilterNode } from "./inputs/script-filter"
import { KeywordTriggerNode } from "./inputs/keyword-trigger"

export const NodeType = z.enum([FileFilterName.value, OpenFileName.value, ScriptFilterName.value])
export const InputsNodes = ScriptFilterNode.or(FileFilterNode).or(KeywordTriggerNode)
export const ActionNodes = OpenFileNode
export const AllNodes = ActionNodes.or(InputsNodes)
export const Edge = z.object({
  srcUuid: uuid,
  targetUuid: uuid
})

/**
 * With nodes and edges, we can construct a adjacency list to represent a graph.
 * The graph will be constructed in the frontend in runtime.
 * Storing workflow is simply saving this Workflow object as json.
 */
export const Workflow = z.object({
  name: z.string(),
  version: z.string(),
  appVersion: z.string(),
  author: z.string().optional(),
  uuid: z.string().uuid(),
  nodes: z.record(AllNodes),
  edges: Edge.array()
})
export type Workflow = z.infer<typeof Workflow>
