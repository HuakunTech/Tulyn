import { z } from "zod";
import { BaseNode, GeneralDefault, NodeTypeAction, Position } from "../common";

export const OpenFileName = z.literal("open_file");

/**
 * Open a file with given app.
 * Input field can be a hard coded path or by default (if set to GeneralDefault) it will be the output from previous node.
 * app field by default will be the default app for the file type. Can be modified to a specific app path
 */
export const OpenFileNode = z
  .object({
    type: NodeTypeAction,
    input: z.string().or(GeneralDefault),
    app: z.string().or(GeneralDefault).default(GeneralDefault.value),
  })
  .merge(BaseNode)
  .merge(Position);
