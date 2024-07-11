import { type EventCallback, type UnlistenFn } from "@tauri-apps/api/event"
import { getCurrent } from "@tauri-apps/api/window"
import { listenToWindowBlur, listenToWindowFocus } from "~/lib/utils/tauri-events"

export const useListenToWindowBlur = async (cb: EventCallback<null>) => {
  const unlisten = ref<UnlistenFn>()
  onMounted(async () => {
    await listenToWindowBlur(cb)
  })
  onUnmounted(() => {
    unlisten.value?.()
  })
}

export const useListenToWindowFocus = async (cb: EventCallback<null>) => {
  const unlisten = ref<UnlistenFn>()
  onMounted(async () => {
    await listenToWindowFocus(cb)
  })
  onUnmounted(() => {
    unlisten.value?.()
  })
}

/**
 * Prevent current window from closing
 */
export const usePreventExit = () => {
  const appWindow = getCurrent()
  if (!appWindow) {
    return
  }
  onMounted(() => {
    appWindow.onCloseRequested(async (event) => {
      event.preventDefault()
      appWindow.hide()
    })
  })
}
