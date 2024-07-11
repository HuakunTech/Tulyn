import { invoke } from "@tauri-apps/api/core"
import type { CmdType, Ext, ExtData } from "../models/extension"

/* -------------------------------------------------------------------------- */
/*                               Extension CRUD                               */
/* -------------------------------------------------------------------------- */
export function createExtension(ext: { identifier: string; version: string }) {
  return invoke<void>("plugin:jarvis|create_extension", ext)
}

export function getAllExtensions() {
  return invoke<Ext[]>("plugin:jarvis|get_all_extensions")
}

export function getExtensionByIdentifier(identifier: string) {
  return invoke<Ext | undefined>("plugin:jarvis|get_extension_by_identifier", { identifier })
}

export function deleteExtensionByIdentifier(identifier: string) {
  return invoke<void>("plugin:jarvis|delete_extension_by_identifier", { identifier })
}
/* -------------------------------------------------------------------------- */
/*                           Extension Command CRUD                           */
/* -------------------------------------------------------------------------- */
export function createCommand(data: {
  extId: number
  name: string
  type: CmdType
  data: string
  alias?: string
  hotkey?: string
}) {
  return invoke<void>("plugin:jarvis|create_command", data)
}

export function getCommandById(cmdId: number) {
  return invoke<Ext | undefined>("plugin:jarvis|get_command_by_id", { cmdId })
}

export function getCommandsByExtId(extId: number) {
  return invoke<Ext[]>("plugin:jarvis|get_commands_by_ext_id", { extId })
}

export function deleteCommandById(cmdId: number) {
  return invoke<void>("plugin:jarvis|delete_command_by_id", { cmdId })
}

export function updateCommandById(data: {
  cmdId: number
  name: string
  cmdType: CmdType
  data: string
  alias?: string
  hotkey?: string
  enabled: boolean
}) {
  return invoke<void>("plugin:jarvis|update_command_by_id", data)
}

/* -------------------------------------------------------------------------- */
/*                             Extension Data CRUD                            */
/* -------------------------------------------------------------------------- */
export function createExtensionData(data: {
  extId: number
  dataType: string
  data: string
  searchText?: string
}) {
  return invoke<void>("plugin:jarvis|create_extension_data", data)
}

export function getExtensionDataById(dataId: number) {
  return invoke<ExtData | undefined>("plugin:jarvis|get_extension_data_by_id", { dataId })
}

export function searchExtensionData(data: {
  extId: number
  dataType?: string
  searchText?: string
  afterCreatedAt?: string
  beforeCreatedAt?: string
}) {
  return invoke<ExtData[]>("plugin:jarvis|search_extension_data", data)
}

export function deleteExtensionDataById(dataId: number) {
  return invoke("plugin:jarvis|delete_extension_data_by_id", { dataId })
}

export function updateExtensionDataById(data: {
  dataId: number
  data: string
  searchText?: string
}) {
  return invoke("plugin:jarvis|update_extension_data_by_id", data)
}
