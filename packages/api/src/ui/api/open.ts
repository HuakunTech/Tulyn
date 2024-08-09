import { getDefaultClientAPI } from "tauri-api-adapter"
import { type IOpen } from "../client"
import type { IOpenServer } from "../server/open"

const defaultClientAPI = getDefaultClientAPI<IOpenServer>()
export const comlinkOpen: IOpen = {
	openUrl: (url: string) => defaultClientAPI.openUrl(url),
	openFile: (path: string) => defaultClientAPI.openUrl(path),
	openFolder: (path: string) => defaultClientAPI.openUrl(path)
}
