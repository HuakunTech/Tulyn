import {
  boolean,
  date,
  enum_,
  number,
  object,
  optional,
  record,
  string,
  type InferOutput
} from "valibot"

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
  extId: number(),
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
  cmdId: number(),
  extId: number(),
  name: string(),
  type: CmdType,
  data: string(),
  alias: optional(string()),
  hotkey: optional(string()),
  enabled: boolean()
})
export type ExtCmd = InferOutput<typeof ExtCmd>

export const ExtData = object({
  dataId: number(),
  extId: number(),
  dataType: string(),
  data: string(),
  searchText: string(),
  createdAt: date(),
  updatedAt: date()
})
export type ExtData = InferOutput<typeof ExtData>
