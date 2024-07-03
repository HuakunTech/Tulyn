import { z } from "zod"
import { computed, map } from "nanostores"
import { AppInfo } from "tauri-plugin-jarvis-api/models"

export const appStateSchema = z.object({
  searchTerm: z.string(),
  allApps: AppInfo.array()
})
export type AppState = z.infer<typeof appStateSchema>

export const $appState = map<AppState>({
  searchTerm: "",
  allApps: []
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
