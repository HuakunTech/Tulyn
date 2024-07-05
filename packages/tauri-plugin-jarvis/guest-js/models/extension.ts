import * as v from "valibot"

/**
 * Map window label to extension
 */
export const ExtensionLabelMap = v.record(
  v.string("Window label"),
  v.object({
    path: v.string("Path to the extension")
  })
)
export type ExtensionLabelMap = v.InferOutput<typeof ExtensionLabelMap>
