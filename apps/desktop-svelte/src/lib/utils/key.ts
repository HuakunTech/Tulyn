import { goto } from "$app/navigation"
import { goBack, goHome } from "./route"

export function goHomeOnEscape(e: KeyboardEvent) {
	if (e.key === "Escape") {
		goHome()
	}
}

export function goBackOnEscape(e: KeyboardEvent) {
	if (e.key === "Escape") {
		goBack()
	}
}
