import { invoke } from "@tauri-apps/api/core"
import { array, literal, optional, parse, safeParse, union, type InferOutput } from "valibot"
import { generateJarvisPluginCommand } from "../common"
import { CmdType, Ext, ExtData } from "../models/extension"
import { convertDateToSqliteString, SQLSortOrder } from "../models/sql"

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
export const ExtDataField = union([literal("data"), literal("search_text")])
export type ExtDataField = InferOutput<typeof ExtDataField>

function convertRawExtDataToExtData(rawData?: {
  createdAt: string
  updatedAt: string
  data: null | string
  searchText: null | string
}): ExtData | undefined {
  if (!rawData) {
    return rawData
  }
  const parsedRes = safeParse(ExtData, {
    ...rawData,
    createdAt: new Date(rawData.createdAt),
    updatedAt: new Date(rawData.updatedAt),
    data: rawData.data ?? undefined,
    searchText: rawData.searchText ?? undefined
  })
  if (parsedRes.success) {
    return parsedRes.output
  } else {
    console.error("Extension Data Parse Failure", parsedRes.issues)
    throw new Error("Fail to parse extension data")
  }
}

export function createExtensionData(data: {
  extId: number
  dataType: string
  data: string
  searchText?: string
}) {
  return invoke<void>(generateJarvisPluginCommand("create_extension_data"), data)
}

export function getExtensionDataById(dataId: number) {
  return invoke<
    | (ExtData & {
        createdAt: string
        updatedAt: string
        data: null | string
        searchText: null | string
      })
    | undefined
  >(generateJarvisPluginCommand("get_extension_data_by_id"), {
    dataId
  }).then(convertRawExtDataToExtData)
}

/**
 * Fields option can be used to select optional fields. By default, if left empty, data and searchText are not returned.
 * This is because data and searchText can be large and we don't want to return them by default.
 * If you just want to get data ids in order to delete them, retrieving all data is not necessary.
 * @param searchParams
 */
export async function searchExtensionData(searchParams: {
  extId: number
  searchExactMatch: boolean
  dataId?: number
  dataType?: string
  searchText?: string
  afterCreatedAt?: string
  beforeCreatedAt?: string
  limit?: number
  orderByCreatedAt?: SQLSortOrder
  orderByUpdatedAt?: SQLSortOrder
  fields?: ExtDataField[]
}): Promise<ExtData[]> {
  const fields = parse(optional(array(ExtDataField), []), searchParams.fields)
  console.log("fields", fields)
  let items = await invoke<
    (ExtData & {
      createdAt: string
      updatedAt: string
      data: null | string
      searchText: null | string
    })[]
  >(generateJarvisPluginCommand("search_extension_data"), { ...searchParams, fields })

  return items.map(convertRawExtDataToExtData).filter((item) => item) as ExtData[]
}

export function deleteExtensionDataById(dataId: number) {
  return invoke<void>(generateJarvisPluginCommand("delete_extension_data_by_id"), { dataId })
}

export function updateExtensionDataById(data: {
  dataId: number
  data: string
  searchText?: string
}) {
  return invoke<void>(generateJarvisPluginCommand("update_extension_data_by_id"), data)
}

/**
 * Database API for extensions.
 * Extensions shouldn't have full access to the database, they can only access their own data.
 * When an extension is loaded, the main thread will create an instance of this class and
 * expose it to the extension.
 */
export class JarvisExtDB {
  extId: number

  constructor(extId: number) {
    this.extId = extId
  }

  async add(data: string, dataType: string = "default", searchText?: string) {
    return createExtensionData({
      data,
      dataType,
      searchText,
      extId: this.extId
    })
  }

  async delete(dataId: number): Promise<void> {
    // Verify if this data belongs to this extension
    const d = await getExtensionDataById(dataId)
    if (!d || d.extId !== this.extId) {
      throw new Error("Extension Data not found")
    }
    return await deleteExtensionDataById(dataId)
  }

  async search(searchParams: {
    dataId?: number
    fullTextSearch?: boolean
    dataType?: string
    searchText?: string
    afterCreatedAt?: Date
    beforeCreatedAt?: Date
    limit?: number
    orderByCreatedAt?: SQLSortOrder
    orderByUpdatedAt?: SQLSortOrder
    fields?: ExtDataField[]
  }): Promise<ExtData[]> {
    const beforeCreatedAt = searchParams.beforeCreatedAt
      ? convertDateToSqliteString(searchParams.beforeCreatedAt)
      : undefined
    const afterCreatedAt = searchParams.afterCreatedAt
      ? convertDateToSqliteString(searchParams.afterCreatedAt)
      : undefined
    return searchExtensionData({
      ...searchParams,
      searchExactMatch: searchParams.fullTextSearch ?? true,
      extId: this.extId,
      beforeCreatedAt,
      afterCreatedAt
    })
  }

  retrieveAll(): Promise<ExtData[]> {
    return this.search({})
  }

  retrieveAllByType(dataType: string): Promise<ExtData[]> {
    return this.search({ dataType })
  }

  deleteAll(): Promise<void> {
    return this.search({})
      .then((items) => {
        return Promise.all(items.map((item) => this.delete(item.dataId)))
      })
      .then(() => {})
  }

  async update(dataId: number, data: string, searchText?: string): Promise<void> {
    const d = await getExtensionDataById(dataId)
    if (!d || d.extId !== this.extId) {
      throw new Error("Extension Data not found")
    }
    return updateExtensionDataById({ dataId, data, searchText })
  }
}
