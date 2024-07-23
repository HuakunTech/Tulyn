import { getDefaultClientAPI } from "tauri-api-adapter"
import { type IUiIframe } from "../client"

export const comlinkUI: IUiIframe = getDefaultClientAPI<IUiIframe>()
