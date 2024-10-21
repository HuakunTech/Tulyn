import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { onOpenUrl } from "@tauri-apps/plugin-deep-link"
import { error } from "@tauri-apps/plugin-log"
import * as v from "valibot"
import { toast } from "vue-sonner"

const StorePathSearchParams = v.object({
	identifier: v.optional(v.string())
})

export async function initDeeplink() {
	const appWindow = getCurrentWebviewWindow()
	if (appWindow.label !== "main") {
		return
	}
	await onOpenUrl((urls) => {
		console.log("deep link:", urls)
		urls.forEach(handleDeepLink)
	})
}

/**
 * Show and focus on the main window
 */
function openMainWindow() {
	const appWindow = getCurrentWebviewWindow()
	return appWindow
		.show()
		.then(() => appWindow.setFocus())
		.catch((err) => {
			console.error(err)
			error(`Failed to show window upon deep link: ${err.message}`)
			toast.error({
				title: "Failed to show window upon deep link",
				description: err.message
			})
		})
}

/**
 *
 * @param url Deep Link URl, e.g. kunkun://open
 */
export async function handleDeepLink(url: string) {
	// Parse the URL
	const parsedUrl = new URL(url)

	// Check if the protocol is correct
	if (parsedUrl.protocol !== "kunkun:") {
		console.error("Invalid protocol:", parsedUrl.protocol)
		return
	}

	// Get the path (content after kunkun://)
	const path = parsedUrl.host // Remove the leading '//' kunkun://open gives "open"

	// Parse query parameters if any
	const params = Object.fromEntries(parsedUrl.searchParams)

	console.log("Parsed deep link:", {
		path,
		params
	})

	// TODO: Handle the parsed deep link based on your application's needs
	// For example:
	switch (path) {
		case "open":
			openMainWindow()
			break
		case "store":
			const parsed = v.parse(StorePathSearchParams, params)
			openMainWindow()
			if (parsed.identifier) {
				navigateTo(`/store/${parsed.identifier}`)
			} else {
				navigateTo("/extension-store")
			}
			break
		default:
			console.warn("Unknown deep link path:", path)
	}
}
