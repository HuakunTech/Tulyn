import { z } from "zod"

/**
 * Map window label to extension
 */
export const ExtensionLabelMap = z.record(
  z.string().describe("Window label"),
  z.object({
    path: z.string().describe("Path to the extension")
  })
)
export type ExtensionLabelMap = z.infer<typeof ExtensionLabelMap>
