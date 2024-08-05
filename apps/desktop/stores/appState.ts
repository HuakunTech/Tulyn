import { platform } from "@tauri-apps/plugin-os"
import { defineStore } from "pinia"

interface AppState {
	searchTerm: string
	platform: string
}

export const useAppStateStore = defineStore("app-state", {
	state: (): AppState => ({
		searchTerm: "",
		platform: platform()
	}),
	actions: {
		setSearchTerm(searchTerm: string) {
			this.searchTerm = searchTerm
		}
	}
})
