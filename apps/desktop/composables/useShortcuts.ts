import { useMagicKeys } from "@vueuse/core"

export const useGoToSettingShortcuts = () => {
  const { meta, comma } = useMagicKeys()

  watch([meta, comma], ([meta, comma]) => {
    if (meta && comma) {
      navigateTo("/settings")
    }
  })
}
