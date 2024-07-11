import { invoke } from "@tauri-apps/api/core"
import { generateJarvisPluginCommand } from "../common"
import type { CmdType, Ext, ExtData } from "../models/extension"

/* -------------------------------------------------------------------------- */
/*                               Extension CRUD                               */
/* -------------------------------------------------------------------------- */
export function createExtension(ext: { identifier: string; version: string }) {
  return invoke<void>(generateJarvisPluginCommand("create_extension"), ext)
}

export function getAllExtensions() {
  return invoke<Ext[]>(generateJarvisPluginCommand("get_all_extensions"))
}

export function getExtensionByIdentifier(identifier: string) {
  return invoke<Ext | undefined>(generateJarvisPluginCommand("get_extension_by_identifier"), {
    identifier
  })
}

export function deleteExtensionByIdentifier(identifier: string) {
  return invoke<void>(generateJarvisPluginCommand("delete_extension_by_identifier"), { identifier })
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
  return invoke<void>(generateJarvisPluginCommand("create_command"), data)
}

export function getCommandById(cmdId: number) {
  return invoke<Ext | undefined>(generateJarvisPluginCommand("get_command_by_id"), { cmdId })
}

export function getCommandsByExtId(extId: number) {
  return invoke<Ext[]>(generateJarvisPluginCommand("get_commands_by_ext_id"), { extId })
}

export function deleteCommandById(cmdId: number) {
  return invoke<void>(generateJarvisPluginCommand("delete_command_by_id"), { cmdId })
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
  return invoke<void>(generateJarvisPluginCommand("update_command_by_id"), data)
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
  return invoke<void>(generateJarvisPluginCommand("create_extension_data"), data)
}

export function getExtensionDataById(dataId: number) {
  return invoke<ExtData | undefined>(generateJarvisPluginCommand("get_extension_data_by_id"), {
    dataId
  })
}

export function searchExtensionData(data: {
  extId: number
  dataType?: string
  searchText?: string
  afterCreatedAt?: string
  beforeCreatedAt?: string
}) {
  return invoke<ExtData[]>(generateJarvisPluginCommand("search_extension_data"), data)
}

export function deleteExtensionDataById(dataId: number) {
  return invoke(generateJarvisPluginCommand("delete_extension_data_by_id"), { dataId })
}

export function updateExtensionDataById(data: {
  dataId: number
  data: string
  searchText?: string
}) {
  return invoke(generateJarvisPluginCommand("update_extension_data_by_id"), data)
}
