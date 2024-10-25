import {
	DEEP_LINK_PATH_OPEN,
	DEEP_LINK_PATH_REFRESH_DEV_EXTENSION,
	DEEP_LINK_PATH_STORE
} from "@kksh/api"
import { extname } from "@tauri-apps/api/path"
import { getCurrentWebviewWindow, WebviewWindow } from "@tauri-apps/api/webviewWindow"
import { onOpenUrl } from "@tauri-apps/plugin-deep-link"
import { error } from "@tauri-apps/plugin-log"
import { emitRefreshDevExt } from "~/lib/utils/tauri-events"
import * as v from "valibot"
import { toast } from "vue-sonner"
import { DEEP_LINK_INSTALL_EXTENSION_WINDOW_LABEL } from "../constants"

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

export async function handleKunkunProtocol(parsedUrl: URL) {
	const path = parsedUrl.host // Remove the leading '//' kunkun://open gives "open"
	const params = Object.fromEntries(parsedUrl.searchParams)
	switch (path) {
		case DEEP_LINK_PATH_OPEN:
			openMainWindow()
			break
		case DEEP_LINK_PATH_STORE:
			const parsed = v.parse(StorePathSearchParams, params)
			openMainWindow()
			if (parsed.identifier) {
				navigateTo(`/store/${parsed.identifier}`)
			} else {
				navigateTo("/extension-store")
			}
			break
		case DEEP_LINK_PATH_REFRESH_DEV_EXTENSION:
			emitRefreshDevExt()
			break
		default:
			console.warn("Unknown deep link path:", path)
	}
}

export async function handleFileProtocol(parsedUrl: URL) {
	console.log("File protocol:", parsedUrl)
	const filePath = parsedUrl.pathname // Remove the leading '//' kunkun://open?identifier=qrcode gives "open"
	console.log("File path:", filePath)
	// from file absolute path, get file extension
	const fileExt = await extname(filePath)
	console.log("File extension:", fileExt)
	switch (fileExt) {
		case "kunkun":
			// TODO: Handle file protocol, install extension from file (essentially a .tgz file)
			const url = `/add-dev-ext?path=${encodeURIComponent(filePath)}`
			new WebviewWindow(DEEP_LINK_INSTALL_EXTENSION_WINDOW_LABEL, {
				url
			})
			// navigateTo("/add-dev-ext")
			break
		default:
			console.error("Unknown file extension:", fileExt)
			toast.error({
				title: "Unknown file extension",
				description: fileExt
			})
			break
	}
}

/**
 *
 * @param url Deep Link URl, e.g. kunkun://open
 */
export async function handleDeepLink(url: string) {
	const parsedUrl = new URL(url)
	switch (parsedUrl.protocol) {
		case "kunkun:":
			return handleKunkunProtocol(parsedUrl)
		case "file:":
			return handleFileProtocol(parsedUrl)
		default:
			console.error("Invalid Protocol:", parsedUrl.protocol)
			toast.error({
				title: "Invalid Protocol",
				description: parsedUrl.protocol
			})
			break
	}
}
