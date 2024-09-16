import { defineStore } from "pinia"

export type QuickLinkQuery = {
	value: string
	name: string
}

interface State {
	quickLinkInputs: QuickLinkQuery[]
}

export const useQuickLinksStore = defineStore("quick-links", {
	state: (): State => ({
		quickLinkInputs: [
			{
				value: "",
				name: "Tauri"
			},
			{
				value: "",
				name: "Vue"
			},
			{
				value: "",
				name: "React"
			}
		]
	}),
	actions: {}
})
