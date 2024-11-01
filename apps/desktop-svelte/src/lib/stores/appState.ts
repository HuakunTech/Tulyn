import type { AppState } from "@/types"
import { writable, type Writable } from "svelte/store"

export const defaultAppState: AppState = {
	searchTerm: "",
	highlightedCmd: ""
}

interface AppStateAPI {
	clearSearchTerm: () => void
}

function createAppState(): Writable<AppState> & AppStateAPI {
	const { subscribe, update, set } = writable<AppState>(defaultAppState)

	return {
		subscribe,
		update,
		set,
		clearSearchTerm: () => {
			update((state) => ({ ...state, searchTerm: "" }))
		}
	}
}

export const appState = createAppState()
