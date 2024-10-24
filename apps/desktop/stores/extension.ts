import { constructExtensionSupportDir } from "@kksh/api"
import { db, registerExtensionWindow, unregisterExtensionWindow } from "@kksh/api/commands"
import type { CustomUiCmd, ExtPackageJsonExtra, OSPlatform, TemplateUiCmd } from "@kksh/api/models"
import { convertFileSrc } from "@tauri-apps/api/core"
import { appDataDir, join } from "@tauri-apps/api/path"
import { WebviewWindow } from "@tauri-apps/api/webviewWindow"
import * as fs from "@tauri-apps/plugin-fs"
import { debug, error } from "@tauri-apps/plugin-log"
import { platform, type Platform } from "@tauri-apps/plugin-os"
import { loadAllExtensionsFromDisk } from "~/lib/commands/extensions"
import { getExtensionsFolder } from "~/lib/constants"
import { getPersistedAppConfigStore } from "~/lib/stores/appConfig"
import { ListItemType, type TListItem } from "~/lib/types/list"
import { filterListItem } from "~/lib/utils/search"
import { defineStore } from "pinia"
import { v4 as uuidv4 } from "uuid"
import * as v from "valibot"
import { toast } from "vue-sonner"
import { useAppStateStore } from "./appState"

function manifestToCmdItems(manifest: ExtPackageJsonExtra, isDev: boolean): TListItem[] {
	const _platform = platform() as OSPlatform
	const uiItems = manifest.kunkun.customUiCmds
		.filter((cmd) => cmd.platforms.includes(_platform))
		.map((cmd) => cmdToItem(cmd, manifest, ListItemType.enum.UICmd, isDev))
	const inlineItems = manifest.kunkun.templateUiCmds
		.filter((cmd) => cmd.platforms.includes(_platform))
		.map((cmd) => cmdToItem(cmd, manifest, ListItemType.enum.InlineCmd, isDev))
	return [...uiItems, ...inlineItems]
}

function trimSlash(str: string) {
	return str.replace(/^\/+|\/+$/g, "")
}

async function createExtSupportDir(extPath: string) {
	const extSupportDir = await constructExtensionSupportDir(extPath)
	if (!(await fs.exists(extSupportDir))) {
		await fs.mkdir(extSupportDir, { recursive: true })
	}
}

function getNewExtWindow(windowLabel: string, url: string, cmd: CustomUiCmd | TemplateUiCmd) {
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

	return window
}

function createNewExtWindowForUiCmd(manifest: ExtPackageJsonExtra, cmd: CustomUiCmd, url: string) {
	const windowExtMapStore = useWindowExtMapStore()
	return registerExtensionWindow({ extensionPath: manifest.extPath, dist: cmd.dist }).then(
		async (windowLabel) => {
			windowExtMapStore.registerExtensionWithWindow(windowLabel, manifest.extPath)
			const window = getNewExtWindow(windowLabel, url, cmd)
			window.onCloseRequested(async (event) => {
				await unregisterExtensionWindow(window.label)
				windowExtMapStore.unregisterExtensionFromWindow(windowLabel)
			})
		}
	)
}

function createNewExtWindowForTemplateCmd(
	manifest: ExtPackageJsonExtra,
	cmd: TemplateUiCmd,
	url: string
) {
	const windowExtMapStore = useWindowExtMapStore()
	return registerExtensionWindow({ extensionPath: manifest.extPath }).then(async (windowLabel) => {
		windowExtMapStore.registerExtensionWithWindow(windowLabel, manifest.extPath)
		const window = getNewExtWindow(windowLabel, url, cmd)
		window.onCloseRequested(async (event) => {
			await unregisterExtensionWindow(window.label)
			windowExtMapStore.unregisterExtensionFromWindow(windowLabel)
		})
	})
}

export const useExtensionStore = defineStore("kk-extensions", () => {
	const manifests = ref<ExtPackageJsonExtra[]>([])
	const appStateStore = useAppStateStore()
	const isDev = false

	async function load() {
		const extDir = await getExtensionsFolder()
		return loadAllExtensionsFromDisk(extDir)
			.then((exts) => {
				manifests.value = exts
				console.log(exts)
			})
			.catch((err) => {
				console.error(err)
				toast.error(`Failed to load extensions from ${extDir}`)
			})
	}

	async function onSelect(item: TListItem) {
		const appConfig = useAppConfigStore()
		manifests.value.forEach((manifest) => {
			if (item.type == "UI Command") {
				manifest.kunkun.customUiCmds.forEach(async (cmd) => {
					if (item.value.data === generateItemValue(manifest, cmd, isDev)) {
						createExtSupportDir(manifest.extPath)
						let url = cmd.main
						if (appConfig.devExtLoadUrl && isDev && cmd.devMain) {
							url = cmd.devMain
						} else {
							if (cmd.main.startsWith("http")) {
								url = cmd.main
							} else {
								// const port = await getServerPort()
								// const postfix = !cmd.main.endsWith(".html") && !cmd.main.endsWith("/") ? "/" : ""
								// console.log("postfix: ", postfix)
								// url = `ext://${manifest.kunkun.identifier}.${cmd.dist}.${isDev ? "dev-" : ""}ext${cmd.main.startsWith("/") ? "" : "/"}${cmd.main}`
								url = convertFileSrc(`${trimSlash(cmd.main)}`, isDev ? "dev-ext" : "ext")
								// url = convertFileSrc(
								// 	`${manifest.kunkun.identifier}/${trimSlash(cmd.dist)}/${trimSlash(cmd.main)}`,
								// 	isDev ? "dev-ext" : "ext"
								// )
								// url decode url
								url = decodeURIComponent(url)
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
						console.log("url", url)

						const url2 = `/iframe-ext?url=${encodeURIComponent(url)}&extPath=${encodeURIComponent(manifest.extPath)}`
						if (cmd.window) {
							createNewExtWindowForUiCmd(manifest, cmd, url2)
						} else {
							const windowExtMapStore = useWindowExtMapStore()
							windowExtMapStore.registerExtensionWithWindow("main", manifest.extPath)
							registerExtensionWindow({
								extensionPath: manifest.extPath,
								windowLabel: "main",
								dist: cmd.dist
							})
							navigateTo(url2)
						}
					}
				})
			} else if (item.type === "Template Command") {
				manifest.kunkun.templateUiCmds.forEach(async (cmd) => {
					const localePath = useLocalePath()
					if (item.value.data === generateItemValue(manifest, cmd, isDev)) {
						createExtSupportDir(manifest.extPath)
						const main = cmd.main
						const scriptPath = await join(manifest.extPath, main)
						if (!(await fs.exists(scriptPath))) {
							toast.error(`Extension Script not found: ${scriptPath}`)
							error(`Extension Script not found: ${scriptPath}`)
							return
						}
						debug(`Running Template command: ${scriptPath}`)
						// extStore.setCurrentWorkerExt({
						// 	manifest,
						// 	cmdName: cmd.name
						// })
						const url2 = `/worker-ext?extPath=${encodeURIComponent(manifest.extPath)}&cmdName=${encodeURIComponent(cmd.name)}`

						if (cmd.window) {
							createNewExtWindowForTemplateCmd(manifest, cmd, url2)
							// createNewExtWindowForTemplateCmd(manifest, cmd, url2)
						} else {
							console.log("registerExtensionWithWindow", "main", manifest.extPath)
							const windowExtMapStore = useWindowExtMapStore()
							windowExtMapStore.registerExtensionWithWindow("main", manifest.extPath)
							registerExtensionWindow({ extensionPath: manifest.extPath, windowLabel: "main" })
							navigateTo(url2)
						}
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
	}

	const $listItems = computed(() => {
		const listItems = manifests.value.map((manifest) => manifestToCmdItems(manifest, isDev)).flat()
		return listItems
	})
	const $filteredListItems = computed<TListItem[]>(() => {
		return appStateStore.searchTerm.length === 0
			? $listItems.value
			: filterListItem(appStateStore.searchTerm, $listItems.value)
	})

	/**
	 * This function uninstalls extensions installed from store by identifier
	 * Identifier could repeat in database if there is dev extensions, but extensions installed from store should only have one instance
	 * @param identifier
	 * @returns
	 */
	async function uninstallStoreExtByIdentifier(identifier: string): Promise<ExtPackageJsonExtra> {
		const storeExtDir = await getExtensionsFolder()
		const found = manifests.value.find(
			(m) => m.kunkun.identifier === identifier && m.extPath.startsWith(storeExtDir)
		)
		if (found) {
			return fs.remove(found.extPath, { recursive: true }).then(() => {
				return db.deleteExtensionByPath(found.extPath).then(() => {
					return found
				})
			})
		} else {
			console.error("Extension not found", identifier)
			return Promise.reject("Extension not found")
		}
	}

	function uninstallExtByExtPath(extPath: string) {
		console.log("uninstallExt", extPath)
		const found = manifests.value.find((m) => m.extPath === extPath)
		if (found) {
			return fs.remove(found.extPath, { recursive: true }).then(() => {
				return found
			})
		} else {
			console.error("Extension not found at", extPath)
			return Promise.reject("Extension not found")
		}
	}

	return {
		id: uuidv4(),
		extensionName: "Extensions",
		$listItems,
		manifests,
		$filteredListItems,
		onSelect,
		load,
		uninstallExt: uninstallStoreExtByIdentifier
	} satisfies IExtensionLoader & {
		uninstallExt: (extPath: string) => Promise<ExtPackageJsonExtra>
		manifests: Ref<ExtPackageJsonExtra[]>
	}
})
