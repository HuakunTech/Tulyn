/**
 * `tauri-api-adapter` contains a `constructEventApi()`.
 * We don't use that one because it exposes raw `listen()` and `emit()`, which may expose too much power to the client.
 * Instead in this project, we define a custom `IEventServer` interface and `constructEventApi()` function that
 * only exposes a limited set of events.
 */
import { listen, TauriEvent } from "@tauri-apps/api/event"
import type { EventPermission } from "../api/permissions"
import type { DragDropPayload, DragEnterPayload, DragOverPayload, IEvent } from "../client"

export interface IEventServer {
	eventOnDragDrop: IEvent["onDragDrop"]
	eventOnDragEnter: IEvent["onDragEnter"]
	eventOnDragLeave: IEvent["onDragLeave"]
	eventOnDragOver: IEvent["onDragOver"]
	eventOnWindowBlur: IEvent["onWindowBlur"]
	eventOnWindowCloseRequested: IEvent["onWindowCloseRequested"]
	eventOnWindowFocus: IEvent["onWindowFocus"]
}

function checkPermission(permissions: EventPermission[], permission: EventPermission) {
	if (!permissions.includes(permission)) {
		throw new Error(`${permission} permission is required`)
	}
}

export function constructEventApi(permissions: EventPermission[]): IEventServer {
	return {
		eventOnDragDrop: (callback) => {
			checkPermission(permissions, "event:drag-drop")
			listen<DragDropPayload>(TauriEvent.DRAG_DROP, (e) => {
				callback(e.payload)
			})
		},
		eventOnDragEnter: (callback) => {
			checkPermission(permissions, "event:drag-enter")
			listen<DragEnterPayload>(TauriEvent.DRAG_ENTER, (e) => {
				callback(e.payload)
			})
		},
		eventOnDragLeave: (callback) => {
			checkPermission(permissions, "event:drag-leave")
			listen<null>(TauriEvent.DRAG_LEAVE, (e) => {
				callback()
			})
		},
		eventOnDragOver: (callback) => {
			checkPermission(permissions, "event:drag-over")
			listen<DragOverPayload>(TauriEvent.DRAG_OVER, (e) => {
				callback(e.payload)
			})
		},
		eventOnWindowBlur: (callback) => {
			checkPermission(permissions, "event:window-blur")
			listen<null>(TauriEvent.WINDOW_BLUR, (e) => {
				callback()
			})
		},
		eventOnWindowCloseRequested: (callback) => {
			checkPermission(permissions, "event:window-close-requested")
			listen<null>(TauriEvent.WINDOW_CLOSE_REQUESTED, (e) => {
				callback()
			})
		},
		eventOnWindowFocus: (callback) => {
			checkPermission(permissions, "event:window-focus")
			listen<null>(TauriEvent.WINDOW_FOCUS, (e) => {
				callback()
			})
		}
	}
}
