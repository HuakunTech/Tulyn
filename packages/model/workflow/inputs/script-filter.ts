import { z } from "zod";
import { BaseNode, NodeTypeInput, Position } from "../common";

export const ScriptFilterName = z.literal("script_filter");

export const ScriptFilterNode = z
  .object({
    type: NodeTypeInput,
    name: ScriptFilterName,
    keyword: z.string(),
    workflowIcon: z.string(),
    title: z.string(),
    subtext: z.string(),
    pleaseWaitSubtext: z.string().default("Please Wait..."),
    script: z.string(),
    language: z.string(),
  })
  .merge(BaseNode)
  .merge(Position);
