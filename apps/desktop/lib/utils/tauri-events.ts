import {
	emit,
	emitTo,
	listen,
	TauriEvent,
	type Event,
	type EventCallback,
	type UnlistenFn
} from "@tauri-apps/api/event"

export const FileDrop = "tauri://drop"
export const FileDrag = "tauri://drag"
export const FileDragCancelled = "tauri://drag-cancelled"
export const FileDragOver = "tauri://drag-over"
export const NewClipboardItemAddedEvent = "new_clipboard_item_added"
export const RefreshConfigEvent = "kksh://refresh-config"
export const RefreshExtEvent = "kksh://refresh-extensions"
export const RefreshWorkerExtEvent = "kksh://refresh-worker-ext"

export function listenToFileDrop(cb: EventCallback<{ paths: string[] }>) {
	return listen<{ paths: string[] }>(FileDrop, cb)
}

export function listenToWindowBlur(cb: EventCallback<null>) {
	return listen(TauriEvent.WINDOW_BLUR, cb)
}

export function listenToWindowFocus(cb: EventCallback<null>) {
	return listen(TauriEvent.WINDOW_FOCUS, cb)
}

export function listenToNewClipboardItem(cb: EventCallback<null>) {
	return listen(NewClipboardItemAddedEvent, cb)
}

export function emitRefreshConfig() {
	return emit(RefreshConfigEvent)
}

export function listenToRefreshConfig(cb: EventCallback<null>) {
	return listen(RefreshConfigEvent, cb)
}

export function emitRefreshExt() {
	return emitTo("main", RefreshExtEvent)
}

export function listenToRefreshExt(cb: EventCallback<null>) {
	return listen(RefreshExtEvent, cb)
}

export function emitRefreshWorkerExt() {
	return emit(RefreshWorkerExtEvent)
}

export function listenToRefreshWorkerExt(cb: EventCallback<null>) {
	return listen(RefreshWorkerExtEvent, cb)
}
