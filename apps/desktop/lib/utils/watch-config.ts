import { info } from "@tauri-apps/plugin-log"
import { Store } from "@tauri-apps/plugin-store"
import { useAppConfigStore } from "~/stores/appConfig"
import { emitRefreshConfig } from "./tauri-events"

// export function useWatchAppConfig() {
//   const appConfig = useAppConfigStore()
//   appConfig.$subscribe((mutation, state) => {
//     const persistAppConfig = new Store("appConfig.bin")
//     console.log("mutation", mutation)
//     info("appConfig changed, saved to disk")
//     persistAppConfig.set("config", state)
//     persistAppConfig.save()
//     // emitRefreshConfig()
//   })
// }
