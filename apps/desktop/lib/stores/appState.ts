import { os } from "@kksh/api/ui"
import { platform } from "@tauri-apps/plugin-os"
import { computed, map } from "nanostores"
import { AppInfo } from "tauri-plugin-jarvis-api/models"
import { literal, object, string, union, type InferOutput } from "valibot"

export const appStateSchema = object({
  searchTerm: string(),
  // allApps: array(AppInfo),
  platform: union([
    literal("linux"),
    literal("macos"),
    literal("ios"),
    literal("freebsd"),
    literal("dragonfly"),
    literal("netbsd"),
    literal("openbsd"),
    literal("solaris"),
    literal("android"),
    literal("windows")
  ])
})
export type AppState = InferOutput<typeof appStateSchema>

export const $appState = map<AppState>({
  searchTerm: "",
  // allApps: [],
  platform: platform()
})

export function setSearchTerm(searchTerm: string) {
  $appState.setKey("searchTerm", searchTerm)
}

// export function setAllApps(allApps: AppInfo[]) {
//   $appState.setKey("allApps", allApps)
// }

// export const $filteredApps = computed($appState, (state) => {
//   if (state.searchTerm.trim().length < 2) return []; // return nothing if no search term
//   return state.allApps.filter((app) => {
//     return app.name.toLowerCase().includes(state.searchTerm.toLowerCase());
//   });
// });
