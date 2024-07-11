import {
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
