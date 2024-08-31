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

function checkPermission(
	userPermissions: EventPermission[],
	requiredPermissions: EventPermission[]
) {
	if (!requiredPermissions.some((p) => userPermissions.includes(p))) {
		throw new Error(`${requiredPermissions.join(" or ")} permission is required`)
	}
}

export function constructEventApi(permissions: EventPermission[]): IEvent {
	return {
		onDragDrop: (callback) => {
			checkPermission(permissions, EventPermissionMap.onDragDrop)
			listen<DragDropPayload>(TauriEvent.DRAG_DROP, (e) => {
				callback(e.payload)
			})
		},
		onDragEnter: (callback) => {
			checkPermission(permissions, EventPermissionMap.onDragEnter)
			listen<DragEnterPayload>(TauriEvent.DRAG_ENTER, (e) => {
				callback(e.payload)
			})
		},
		onDragLeave: (callback) => {
			checkPermission(permissions, EventPermissionMap.onDragLeave)
			listen<null>(TauriEvent.DRAG_LEAVE, (e) => {
				callback()
			})
		},
		onDragOver: (callback) => {
			checkPermission(permissions, EventPermissionMap.onDragOver)
			listen<DragOverPayload>(TauriEvent.DRAG_OVER, (e) => {
				callback(e.payload)
			})
		},
		onWindowBlur: (callback) => {
			checkPermission(permissions, EventPermissionMap.onWindowBlur)
			listen<null>(TauriEvent.WINDOW_BLUR, (e) => {
				callback()
			})
		},
		onWindowCloseRequested: (callback) => {
			checkPermission(permissions, EventPermissionMap.onWindowCloseRequested)
			listen<null>(TauriEvent.WINDOW_CLOSE_REQUESTED, (e) => {
				callback()
			})
		},
		onWindowFocus: (callback) => {
			checkPermission(permissions, EventPermissionMap.onWindowFocus)
			listen<null>(TauriEvent.WINDOW_FOCUS, (e) => {
				callback()
			})
		}
	}
}
