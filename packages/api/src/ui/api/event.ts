import { proxy } from "@huakunshen/comlink"
import { getDefaultClientAPI } from "tauri-api-adapter"
import type { DragDropPayload, DragEnterPayload, DragOverPayload, IEvent } from "../client"
import type { IEventServer } from "../server/event"

const defaultClientAPI = getDefaultClientAPI<IEventServer>()

export const comlinkEvent: IEvent = {
	onDragDrop: (callback: (payload: DragDropPayload) => void) =>
		defaultClientAPI.eventOnDragDrop(proxy(callback)),
	onDragEnter: (callback: (payload: DragEnterPayload) => void) =>
		defaultClientAPI.eventOnDragEnter(proxy(callback)),
	onDragLeave: (callback: () => void) => defaultClientAPI.eventOnDragLeave(proxy(callback)),
	onDragOver: (callback: (payload: DragOverPayload) => void) =>
		defaultClientAPI.eventOnDragOver(proxy(callback)),
	onWindowBlur: (callback: () => void) => defaultClientAPI.eventOnWindowBlur(proxy(callback)),
	onWindowCloseRequested: (callback: () => void) =>
		defaultClientAPI.eventOnWindowCloseRequested(proxy(callback)),
	onWindowFocus: (callback: () => void) => defaultClientAPI.eventOnWindowFocus(proxy(callback))
	// onWindowThemeChanged: defaultClientAPI.eventOnWindowThemeChanged
}
