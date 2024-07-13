import { getDefaultClientAPI } from "tauri-api-adapter"
import { type IUi } from "../client"

export const comlinkUI: IUi = getDefaultClientAPI<IUi>()
