import { listen, type EventCallback, type UnlistenFn } from "@tauri-apps/api/event"

/* ------------------------------- Event Names ------------------------------ */
export const RECORD_EXTENSION_PROCESS_EVENT = "record-extension-process"
export interface IRecordExtensionProcessEvent {
	windowLabel: string
	pid: number
}

/**
 * listen to RECORD_EXTENSION_PROCESS_EVENT
 * This event is emitted when an extension spawns a process. Processes won't be cleaned up automatically
 * Extensions should clean up the processes when extension quits, but there is no way to guarantee this.
 * So we need to record the processes spawned from extensions and clean up the processes when extension quits.
 * @param callback 
 * @returns 
 */
export function listenToRecordExtensionProcessEvent(
	callback: EventCallback<IRecordExtensionProcessEvent>
): Promise<UnlistenFn> {
	return listen<IRecordExtensionProcessEvent>(RECORD_EXTENSION_PROCESS_EVENT, callback)
}
