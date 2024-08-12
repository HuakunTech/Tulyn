/**
 * `tauri-api-adapter` contains a `constructEventApi()`.
 * We don't use that one because it exposes raw `listen()` and `emit()`, which may expose too much power to the client.
 * Instead in this project, we define a custom `IEventServer` interface and `constructEventApi()` function that
 * only exposes a limited set of events.
 */
import { listen, TauriEvent } from "@tauri-apps/api/event"
import { type EventPermission } from "../../permissions"
import { EventPermissionMap } from "../../permissions/permission-map"
import type { DragDropPayload, DragEnterPayload, DragOverPayload, IEvent } from "../client"
import type { IEventServer } from "./server-types"

function checkPermission(
	userPermissions: EventPermission[],
	requiredPermissions: EventPermission[]
) {
	if (!requiredPermissions.some((p) => userPermissions.includes(p))) {
		throw new Error(`${requiredPermissions.join(" or ")} permission is required`)
	}
}

export function constructEventApi(permissions: EventPermission[]): IEventServer {
	return {
		eventOnDragDrop: (callback) => {
			checkPermission(permissions, EventPermissionMap.eventOnDragDrop)
			listen<DragDropPayload>(TauriEvent.DRAG_DROP, (e) => {
				callback(e.payload)
			})
		},
		eventOnDragEnter: (callback) => {
			checkPermission(permissions, EventPermissionMap.eventOnDragEnter)
			listen<DragEnterPayload>(TauriEvent.DRAG_ENTER, (e) => {
				callback(e.payload)
			})
		},
		eventOnDragLeave: (callback) => {
			checkPermission(permissions, EventPermissionMap.eventOnDragLeave)
			listen<null>(TauriEvent.DRAG_LEAVE, (e) => {
				callback()
			})
		},
		eventOnDragOver: (callback) => {
			checkPermission(permissions, EventPermissionMap.eventOnDragOver)
			listen<DragOverPayload>(TauriEvent.DRAG_OVER, (e) => {
				callback(e.payload)
			})
		},
		eventOnWindowBlur: (callback) => {
			checkPermission(permissions, EventPermissionMap.eventOnWindowBlur)
			listen<null>(TauriEvent.WINDOW_BLUR, (e) => {
				callback()
			})
		},
		eventOnWindowCloseRequested: (callback) => {
			checkPermission(permissions, EventPermissionMap.eventOnWindowCloseRequested)
			listen<null>(TauriEvent.WINDOW_CLOSE_REQUESTED, (e) => {
				callback()
			})
		},
		eventOnWindowFocus: (callback) => {
			checkPermission(permissions, EventPermissionMap.eventOnWindowFocus)
			listen<null>(TauriEvent.WINDOW_FOCUS, (e) => {
				callback()
			})
		}
	}
}
