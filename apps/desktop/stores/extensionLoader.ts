import { loadAllExtensionsFromDisk } from "@/lib/commands/extensions"
import { ListItemType, TListGroup, TListItem } from "@/lib/types/list"
import {
	getServerPort,
	pathExists,
	registerExtensionWindow,
	unregisterExtensionWindow
} from "@kksh/api/commands"
import {
	CustomUiCmd,
	ExtPackageJsonExtra,
	KunkunExtManifest,
	TemplateUiCmd,
	WindowConfig
} from "@kksh/api/models"
import { join } from "@tauri-apps/api/path"
import { WebviewWindow } from "@tauri-apps/api/webviewWindow"
import * as fs from "@tauri-apps/plugin-fs"
import { exists } from "@tauri-apps/plugin-fs"
import { debug, error, info, warn } from "@tauri-apps/plugin-log"
import { computedAsync } from "@vueuse/core"
import { filterListItem } from "~/lib/utils/search"
import { useAppConfigStore } from "~/stores/appConfig"
import { useExtDisplayStore } from "~/stores/extState"
import { atom, type WritableAtom } from "nanostores"
import { defineStore } from "pinia"
import { v4 as uuidv4 } from "uuid"
import { toast } from "vue-sonner"
import { useAppStateStore } from "./appState"

/**
 * Generate a value (unique identified) for a command in an extension
 * @param ext Extension Manifest
 * @param cmd Command in Extension
 * @returns
 */
export function generateItemValue(
	ext: ExtPackageJsonExtra,
	cmd: CustomUiCmd | TemplateUiCmd,
	isDev: boolean
) {
	return JSON.stringify({
		identifier: ext.kunkun.identifier,
		cmdName: cmd.name,
		isDev
	})
}

export function cmdToItem(
	cmd: CustomUiCmd | TemplateUiCmd,
	manifest: ExtPackageJsonExtra,
	type: ListItemType,
	isDev: boolean
): TListItem {
	return {
		title: cmd.name,
		value: generateItemValue(manifest, cmd as CustomUiCmd, isDev),
		description: cmd.description ?? "",
		flags: { isDev, isRemovable: false },
		type,
		icon: manifest.kunkun.icon,
		keywords: cmd.cmds.map((c) => c.value), // TODO: handle regex as well
		identityFilter: true
	}
}

function createNewExtWindowForUiCmd(manifest: ExtPackageJsonExtra, cmd: CustomUiCmd, url: string) {
	// return registerExtensionWindow(manifest.extPath).then(async (windowLabel) => {
	const windowLabel = `main:ext:${uuidv4()}`
	const window = new WebviewWindow(windowLabel, {
		center: cmd.window?.center ?? undefined,
		x: cmd.window?.x ?? undefined,
		y: cmd.window?.y ?? undefined,
		width: cmd.window?.width ?? undefined,
		height: cmd.window?.height ?? undefined,
		minWidth: cmd.window?.minWidth ?? undefined,
		minHeight: cmd.window?.minHeight ?? undefined,
		maxWidth: cmd.window?.maxWidth ?? undefined,
		maxHeight: cmd.window?.maxHeight ?? undefined,
		resizable: cmd.window?.resizable ?? undefined,
		title: cmd.window?.title ?? cmd.name,
		fullscreen: cmd.window?.fullscreen ?? undefined,
		focus: cmd.window?.focus ?? undefined,
		transparent: cmd.window?.transparent ?? undefined,
		maximized: cmd.window?.maximized ?? undefined,
		visible: cmd.window?.visible ?? false, // default to false to avoid flickering
		decorations: cmd.window?.decorations ?? undefined,
		alwaysOnTop: cmd.window?.alwaysOnTop ?? undefined,
		alwaysOnBottom: cmd.window?.alwaysOnBottom ?? undefined,
		contentProtected: cmd.window?.contentProtected ?? undefined,
		skipTaskbar: cmd.window?.skipTaskbar ?? undefined,
		shadow: cmd.window?.shadow ?? undefined,
		// theme: cmd.window?.theme ?? undefined,
		titleBarStyle: cmd.window?.titleBarStyle ?? undefined,
		hiddenTitle: cmd.window?.hiddenTitle ?? undefined,
		tabbingIdentifier: cmd.window?.tabbingIdentifier ?? undefined,
		maximizable: cmd.window?.maximizable ?? undefined,
		minimizable: cmd.window?.minimizable ?? undefined,
		closable: cmd.window?.closable ?? undefined,
		parent: cmd.window?.parent ?? undefined,
		visibleOnAllWorkspaces: cmd.window?.visibleOnAllWorkspaces ?? undefined,
		url
	})

	window.onCloseRequested(async (event) => {
		// await unregisterExtensionWindow(window.label)
	})
	// })
}

/**
 * Convert a manifest of Jarvis Extension to a list of TListItem, each represent a command
 * @param manifest
 * @returns
 */
export function manifestToCmdItems(manifest: ExtPackageJsonExtra, isDev: boolean): TListItem[] {
	const uiItems = manifest.kunkun.customUiCmds.map((cmd) =>
		cmdToItem(cmd, manifest, ListItemType.enum.UICmd, isDev)
	)
	const inlineItems = manifest.kunkun.templateUiCmds.map((cmd) =>
		cmdToItem(cmd, manifest, ListItemType.enum.InlineCmd, isDev)
	)
	return [...uiItems, ...inlineItems]
}

export function constructExtStore(options: { isDev: boolean }) {
	console.log("Constructing Ext Store", options)
	const storeName = options.isDev ? "dev-extensions" : "extensions"
	return defineStore(storeName, () => {
		const extensionName = ref(options.isDev ? "Dev Extensions" : "Extensions")
		const { isDev } = options
		const appStateStore = useAppStateStore()
		const extPath = ref<string | undefined>()
		const manifests = ref<ExtPackageJsonExtra[]>([])
		async function load() {
			if (!extPath.value || !pathExists(extPath.value)) {
				warn(`Extension path not found: ${extPath.value}`)
				manifests.value = []
			} else {
				extPath.value = extPath.value
				return loadAllExtensionsFromDisk(extPath.value)
					.then((ms) => {
						manifests.value = ms
					})
					.catch((err) => {
						console.error(err)
						toast.error(`Failed to load extensions from ${extPath.value}`)
					})
			}
		}

		function setExtPath(path?: string) {
			extPath.value = path
			return load()
		}

		const $listItems = computed(() => {
			const listItems = manifests.value
				.map((manifest) => manifestToCmdItems(manifest, isDev))
				.flat()
			return listItems
		})
		const $filteredListItems = computed<TListItem[]>(() => {
			return appStateStore.searchTerm.length === 0
				? $listItems.value
				: filterListItem(appStateStore.searchTerm, $listItems.value)
		})

		function groups(): TListGroup[] {
			return manifests.value.map((manifest) => ({
				title: manifest.kunkun.name,
				identifier: manifest.kunkun.identifier,
				type: "Extension",
				icon: manifest.kunkun.icon,
				items: manifestToCmdItems(manifest, isDev),
				flags: { isDev: isDev, isRemovable: true }
			}))
		}

		function uninstallExt(identifier: string): Promise<ExtPackageJsonExtra> {
			const found = manifests.value.find((m) => m.kunkun.identifier === identifier)
			console.log(found)
			if (found) {
				return fs.remove(found.extPath, { recursive: true }).then(() => {
					return found
				})
			} else {
				console.error("Extension not found", identifier)
				return Promise.reject("Extension not found")
			}
		}

		function onSelect(item: TListItem): Promise<void> {
			console.log("on select", item)

			const extStore = useExtDisplayStore()
			const appConfig = useAppConfigStore()
			manifests.value.forEach((manifest) => {
				if (item.type == "UI Command") {
					// console.log(manifest.kunkun.customUiCmds)
					manifest.kunkun.customUiCmds.forEach(async (cmd) => {
						if (item.value === generateItemValue(manifest, cmd, isDev)) {
							let url = cmd.main
							if (appConfig.devExtLoadUrl && isDev && cmd.devMain) {
								url = cmd.devMain
							} else {
								if (cmd.main.startsWith("http")) {
									url = cmd.main
								} else {
									const port = await getServerPort()
									const postfix = !cmd.main.endsWith(".html") && !cmd.main.endsWith("/") ? "/" : ""
									url = `http://localhost:${port}/${isDev ? "dev-" : ""}extensions/${manifest.extFolderName}/${cmd.main}${postfix}`
								}
							}
							// try {
							// 	await axios.get(url)
							// } catch (err) {
							// 	console.error(err)
							// 	error(`Failed to load extension UI at ${url}: ${err}`)
							// 	return ElNotification.error({
							// 		title: "Failed to load extension UI",
							// 		message: `Consider Running the TroubleShooter or turn off dev mode. URL: ${url}`
							// 	})
							// }
							// extStore.setCurrentCustomUiExt({ url, cmd, manifest })
							const url2 = `/iframe-ext?url=${encodeURIComponent(url)}&extPath=${encodeURIComponent(manifest.extPath)}`
							console.log("URL: ", url2)
							if (cmd.window) {
								createNewExtWindowForUiCmd(manifest, cmd, url2)
							} else {
								navigateTo(url2)
							}
						}
					})
				} else if (item.type === "Template Command") {
					console.log("Launch Template Command")

					manifest.kunkun.templateUiCmds.forEach(async (cmd) => {
						const localePath = useLocalePath()
						if (item.value === generateItemValue(manifest, cmd, isDev)) {
							const main = cmd.main
							const scriptPath = await join(manifest.extPath, main)
							if (!(await exists(scriptPath))) {
								toast.error(`Extension Script not found: ${scriptPath}`)
								error(`Extension Script not found: ${scriptPath}`)
								return
							}
							debug(`Running Template command: ${scriptPath}`)
							extStore.setCurrentWorkerExt({
								manifest,
								cmdName: cmd.name
							})
							navigateTo(localePath("/worker-ext"))
						}
					})
				} else if (item.type === "Remote Command") {
					// const remoteExt = new RemoteExtension();
					// const ext = findRemoteExt(item.value);
					// if (ext) {
					//   const window = new WebviewWindow("ext", {
					//     url: ext.url,
					//     title: item.title,
					//     titleBarStyle: "visible",
					//     // titleBarStyle: TitleBarStyle.parse(uiCmd.window?.titleBarStyle?.toLowerCase() ?? "visible"),
					//     // width: uiCmd.window?.width ?? undefined,
					//     // height: uiCmd.window?.height ?? undefined,
					//   });
					// }
				} else {
					toast.error(`Unknown command type: ${item.type}`)
					error(`Unknown command type: ${item.type}`)
				}
			})
			// const foundExt = this.
			return Promise.resolve()
		}

		return {
			id: uuidv4(),
			extensionName,
			isDev,
			groups,
			load,
			extPath,
			setExtPath,
			manifests,
			$listItems,
			$filteredListItems,
			uninstallExt,
			onSelect
		}
	})
}

export const useExtStore = constructExtStore({ isDev: false })
export const useDevExtStore = constructExtStore({ isDev: true })
