import { platform } from "@tauri-apps/plugin-os"
import { defineStore } from "pinia"

interface AppState {
	searchTerm: string
	searchTermSync: string
	platform: string
	updateSearchTermTimeout?: ReturnType<typeof setTimeout>
}

export const useAppStateStore = defineStore("app-state", {
	state: (): AppState => ({
		searchTerm: "",
		searchTermSync: "",
		platform: platform(),
		updateSearchTermTimeout: undefined
	}),
	actions: {
		setSearchTerm(searchTerm: string) {
			this.searchTerm = searchTerm
		},
		setSearchTermSync(searchTermSync: string) {
			this.searchTermSync = searchTermSync
			clearTimeout(this.updateSearchTermTimeout)
			this.updateSearchTermTimeout = setTimeout(() => {
				this.searchTerm = searchTermSync
			}, 100)
		}
	}
})
