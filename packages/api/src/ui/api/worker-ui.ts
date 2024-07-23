import { getDefaultClientAPI } from "tauri-api-adapter"
import { type IUiWorker } from "../client"

export const comlinkUI: IUiWorker = getDefaultClientAPI<IUiWorker>()
