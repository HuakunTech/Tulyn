import type { AppState } from "@/types"
import { writable, type Writable } from "svelte/store"

export const defaultAppState: AppState = {
	searchTerm: "",
	highlightedCmd: ""
}

interface AppStateAPI {}

function createAppState(): Writable<AppState> & AppStateAPI {
	const { subscribe, update, set } = writable<AppState>(defaultAppState)

	return {
		subscribe,
		update,
		set
	}
}

export const appState = createAppState()
