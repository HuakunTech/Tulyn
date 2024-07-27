import { getDefaultClientAPI } from "tauri-api-adapter"
import { type IUiWorker } from "../client"
import type { IUiWorkerServer } from "../server"
import type { IComponent } from "../worker"
import type { List } from "../worker/schema/list"

const defaultClientAPI = getDefaultClientAPI<IUiWorkerServer>()
// export const comlinkUI: IUiWorker = getDefaultClientAPI<IUiWorker>()
export const comlinkUI: IUiWorker = {
	render: defaultClientAPI.workerUiRender,
	setScrollLoading: defaultClientAPI.workerUiSetScrollLoading,
	setSearchTerm: defaultClientAPI.workerUiSetSearchTerm,
	setSearchBarPlaceholder: defaultClientAPI.workerUiSetSearchBarPlaceholder
}
