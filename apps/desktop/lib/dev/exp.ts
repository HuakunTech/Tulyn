import { db } from "tauri-plugin-jarvis-api/commands"
import { constants, ExtData } from "tauri-plugin-jarvis-api/models"
import { parse, safeParse } from "valibot"

export async function useTestDB() {
  // const allExts = await db.getAllExtensions()
  // console.log(allExts)
  //
  // const ext = await db.getExtensionByIdentifier(
  //   constants.JARVIS_EXT_IDENTIFIER.JARVIS_CLIPBOARD_EXT_IDENTIFIER
  // )
  // console.log(ext)
  // if (!ext) {
  //   return
  // }
  // await db.createExtensionData({
  //   extId: ext.extId,
  //   dataType: "text",
  //   data: "huakun zui shuai",
  //   searchText: "huakun"
  // })
  // const data = await db.getExtensionDataById(18)
  // console.log("data", data)
  //
  // // await db.updateExtensionDataById({ dataId: data?.dataId, data: "huakun chao ji shuai 66666", searchText: "haoshuai a 6666" })
  // const searchRes = await db.searchExtensionData({
  //   extId: ext.extId,
  //   searchExactMatch: true,
  //   // dataType: "Html",
  //   searchText: "createdAt"
  //   // afterCreatedAt?: string
  //   // beforeCreatedAt?: string
  // })
  // console.log("searchRes", searchRes)
  const extDB = new db.JarvisExtDB(1)
  const searchRes = await extDB.search({
    fullTextSearch: false,
    searchText: "fullTextSearch",
    fields: []
  })
  console.log("searchRes", searchRes)
}
