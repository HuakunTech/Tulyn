import { z } from "zod"
import { BaseNode, NodeTypeEvent, Position } from "../common"

export const OnClipboardUpdateNode = z
  .object({ type: NodeTypeEvent })
  .merge(BaseNode)
  .merge(Position)
