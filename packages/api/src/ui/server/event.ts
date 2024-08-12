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

function checkPermission(
	userPermissions: EventPermission[],
	requiredPermissions: EventPermission[]
) {
	if (!requiredPermissions.some((p) => userPermissions.includes(p))) {
		throw new Error(`${requiredPermissions.join(" or ")} permission is required`)
	}
}

export const eventRequiredPermissionMap: Record<keyof IEventServer, EventPermission[]> = {
	eventOnDragDrop: ["event:drag-drop"],
	eventOnDragEnter: ["event:drag-enter"],
	eventOnDragLeave: ["event:drag-leave"],
	eventOnDragOver: ["event:drag-over"],
	eventOnWindowBlur: ["event:window-blur"],
	eventOnWindowCloseRequested: ["event:window-close-requested"],
	eventOnWindowFocus: ["event:window-focus"]
}

export function constructEventApi(permissions: EventPermission[]): IEventServer {
	return {
		eventOnDragDrop: (callback) => {
			checkPermission(permissions, eventRequiredPermissionMap.eventOnDragDrop)
			listen<DragDropPayload>(TauriEvent.DRAG_DROP, (e) => {
				callback(e.payload)
			})
		},
		eventOnDragEnter: (callback) => {
			checkPermission(permissions, eventRequiredPermissionMap.eventOnDragEnter)
			listen<DragEnterPayload>(TauriEvent.DRAG_ENTER, (e) => {
				callback(e.payload)
			})
		},
		eventOnDragLeave: (callback) => {
			checkPermission(permissions, eventRequiredPermissionMap.eventOnDragLeave)
			listen<null>(TauriEvent.DRAG_LEAVE, (e) => {
				callback()
			})
		},
		eventOnDragOver: (callback) => {
			checkPermission(permissions, eventRequiredPermissionMap.eventOnDragOver)
			listen<DragOverPayload>(TauriEvent.DRAG_OVER, (e) => {
				callback(e.payload)
			})
		},
		eventOnWindowBlur: (callback) => {
			checkPermission(permissions, eventRequiredPermissionMap.eventOnWindowBlur)
			listen<null>(TauriEvent.WINDOW_BLUR, (e) => {
				callback()
			})
		},
		eventOnWindowCloseRequested: (callback) => {
			checkPermission(permissions, eventRequiredPermissionMap.eventOnWindowCloseRequested)
			listen<null>(TauriEvent.WINDOW_CLOSE_REQUESTED, (e) => {
				callback()
			})
		},
		eventOnWindowFocus: (callback) => {
			checkPermission(permissions, eventRequiredPermissionMap.eventOnWindowFocus)
			listen<null>(TauriEvent.WINDOW_FOCUS, (e) => {
				callback()
			})
		}
	}
}
