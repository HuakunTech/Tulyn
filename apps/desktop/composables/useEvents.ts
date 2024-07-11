import { type EventCallback, type UnlistenFn } from "@tauri-apps/api/event"
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
