import { os } from "jarvis-api/ui"
import { computed, map } from "nanostores"
import { AppInfo } from "tauri-plugin-jarvis-api/models"
import * as v from "valibot"

export const appStateSchema = v.object({
  searchTerm: v.string(),
  allApps: v.array(AppInfo),
  platform: v.union([
    v.literal("linux"),
    v.literal("macos"),
    v.literal("ios"),
    v.literal("freebsd"),
    v.literal("dragonfly"),
    v.literal("netbsd"),
    v.literal("openbsd"),
    v.literal("solaris"),
    v.literal("android"),
    v.literal("windows")
  ])
})
export type AppState = v.InferOutput<typeof appStateSchema>

export const $appState = map<AppState>({
  searchTerm: "",
  allApps: [],
  platform: "macos"
})

os.platform().then((platform) => {
  $appState.setKey("platform", platform)
})

export function setSearchTerm(searchTerm: string) {
  $appState.setKey("searchTerm", searchTerm)
}

export function setAllApps(allApps: AppInfo[]) {
  $appState.setKey("allApps", allApps)
}

// export const $filteredApps = computed($appState, (state) => {
//   if (state.searchTerm.trim().length < 2) return []; // return nothing if no search term
//   return state.allApps.filter((app) => {
//     return app.name.toLowerCase().includes(state.searchTerm.toLowerCase());
//   });
// });
