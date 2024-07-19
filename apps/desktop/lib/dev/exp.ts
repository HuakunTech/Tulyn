import { db } from "tauri-plugin-jarvis-api/commands"
import { constants, ExtData } from "tauri-plugin-jarvis-api/models"
import { parse, safeParse } from "valibot"

export async function useTestDB() {
  // const extDB = new db.JarvisExtDB(1)
  // const searchRes = await extDB.search({
  //   // fullTextSearch: false,
  //   // searchText: "fullTextSearch",
  //   fields: ["search_text"]
  // })
  // console.log("searchRes", searchRes)
}
