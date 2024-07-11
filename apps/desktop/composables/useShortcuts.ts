import { useMagicKeys } from "@vueuse/core"
import { newSettingsPage } from "~/lib/utils/router"

export const useGoToSettingShortcuts = () => {
  const { meta, comma } = useMagicKeys()

  watch([meta, comma], ([meta, comma]) => {
    if (meta && comma) {
      // navigateTo("/settings")
      newSettingsPage()
    }
  })
}
