import { boolean, enum_, number, object, optional, record, string, type InferOutput } from "valibot"

/**
 * Map window label to extension
 */
export const ExtensionLabelMap = record(
  string("Window label"),
  object({
    path: string("Path to the extension")
  })
)
export type ExtensionLabelMap = InferOutput<typeof ExtensionLabelMap>

export const Ext = object({
  ext_id: number(),
  identifier: string(),
  version: string(),
  enabled: boolean(),
  installed_at: string()
})
export type Ext = InferOutput<typeof Ext>
export enum CmdTypeEnum {
  Iframe = "iframe",
  Worker = "worker",
  QuickLink = "quick_link"
}
export const CmdType = enum_(CmdTypeEnum)
export type CmdType = InferOutput<typeof CmdType>
export const ExtCmd = object({
  cmd_id: number(),
  ext_id: number(),
  name: string(),
  type_: CmdType,
  data: string(),
  alias: optional(string()),
  hotkey: optional(string()),
  enabled: boolean()
})
export type ExtCmd = InferOutput<typeof ExtCmd>

export const ExtData = object({
  data_id: number(),
  ext_id: number(),
  data_type: string(),
  data: string(),
  search_text: optional(string()),
  created_at: string(),
  updated_at: string()
})
export type ExtData = InferOutput<typeof ExtData>
