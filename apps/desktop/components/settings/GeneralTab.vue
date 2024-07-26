<script setup lang="ts">
import {
  LoadDevUrl,
  MenuBar,
  Startup,
  Theme,
  ThemeCustomizer,
  TriggerHotkey
} from "@/components/settings/General"
import { Card } from "@/components/ui/card"
import { StrikeSeparator } from "@/components/ui/separator"
import { $appConfig, setDevExtLoadUrl, setShowInTray } from "@/lib/stores/appConfig"
import { unregister } from "@tauri-apps/plugin-global-shortcut"
import { info } from "@tauri-apps/plugin-log"
import { setTriggerHotkey } from "~/lib/stores/appConfig"
import { registerAppHotkey } from "~/lib/utils/hotkey"
import { mapKeyToTauriKey } from "~/lib/utils/js"
import { emitRefreshConfig } from "~/lib/utils/tauri-events"
import { toast } from "vue-sonner"

const savedHotkey = ref<string[]>([])
onMounted(() => {
  const originalHotkey = $appConfig.get().triggerHotkey
  savedHotkey.value = originalHotkey ?? []
})
async function updateHotkey(keys: string[]) {
  savedHotkey.value = keys
  const originalHotkey = $appConfig.get().triggerHotkey
  if (originalHotkey === keys) {
    return info("Trigger hotkey is the same as the original one")
  }
  setTriggerHotkey(savedHotkey.value)
  const hotkeyStr = keys.map(mapKeyToTauriKey).join("+")
  if (originalHotkey) {
    await unregister(originalHotkey.map(mapKeyToTauriKey).join("+"))
  }
  emitRefreshConfig()
  registerAppHotkey(hotkeyStr)
    .then(() => {
      toast.info(`Hotkey set to ${hotkeyStr} successfully`)
    })
    .catch((err) => {
      toast.error(`Failed to set hotkey: ${err}`)
    })
}
</script>
<template>
  <Card class="flex h-full flex-col space-y-4 border-none bg-transparent py-5 shadow-none">
    <Startup />
    <TriggerHotkey :saved-hotkey="savedHotkey" @update:saved-hotkey="updateHotkey" />
    <MenuBar />
    <Theme />
    <StrikeSeparator>
      <span class="whitespace-nowrap break-normal">Developer Setting</span>
    </StrikeSeparator>
    <LoadDevUrl />
  </Card>
</template>
