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

export const Ext = v.object({
  ext_id: v.number(),
  identifier: v.string(),
  version: v.string(),
  enabled: v.boolean(),
  installed_at: v.string()
})
export type Ext = v.InferOutput<typeof Ext>
export enum CmdTypeEnum {
  Iframe = "iframe",
  Worker = "worker",
  QuickLink = "quick_link"
}
export const CmdType = v.enum(CmdTypeEnum)
export type CmdType = v.InferOutput<typeof CmdType>
export const ExtCmd = v.object({
  cmd_id: v.number(),
  ext_id: v.number(),
  name: v.string(),
  type_: CmdType,
  data: v.string(),
  alias: v.optional(v.string()),
  hotkey: v.optional(v.string()),
  enabled: v.boolean()
})
export type ExtCmd = v.InferOutput<typeof ExtCmd>

export const ExtData = v.object({
  data_id: v.number(),
  ext_id: v.number(),
  data_type: v.string(),
  data: v.string(),
  search_text: v.optional(v.string()),
  created_at: v.string(),
  updated_at: v.string()
})
export type ExtData = v.InferOutput<typeof ExtData>
