import { $appState } from "@/lib/stores/appState"
import { ListItemTypeEnum, TListItem } from "@/lib/types/list"
import { getAllApps, refreshApplicationsList } from "@kksh/api/commands"
import { AppInfo, IconEnum } from "@kksh/api/models"
import { convertFileSrc } from "@tauri-apps/api/core"
import { info, warn } from "@tauri-apps/plugin-log"
import { filterListItem } from "~/lib/utils/search"
import { defineStore } from "pinia"
import { executeBashScript, open } from "tauri-plugin-shellx-api"
import { v4 as uuidv4 } from "uuid"
import { useAppStateStore } from "./appState"

/**
 * On MacOS, we use .app folder as unique value to identify an application
 * On Windows, we use app_path_exe. Sometimes in a single app_desktop_path, there are multiple app_path_exe (e.g. adobe acrobat)
 * On Linux, we use app_desktop_path, each app should have a single .desktop file
 * @param app
 * @returns
 */
export function computeItemValue(app: AppInfo & { app_path_exe: string }): string {
	const platform = $appState.get().platform
	if (platform === "windows") {
		return app.app_path_exe
	} else if (platform === "linux" || platform === "macos") {
		return app.app_desktop_path
	} else {
		warn(`Unsupported platform: ${platform}`)
		return ""
	}
}

export function appInfoToListItem(app: AppInfo & { app_path_exe: string }): TListItem {
	return {
		title: app.name,
		value: computeItemValue(app),
		description: "",
		type: ListItemTypeEnum.Application,
		icon: app.icon_path
			? { type: IconEnum.RemoteUrl, value: convertFileSrc(app.icon_path, "appicon") }
			: null,
		keywords: app.name.split(" "),
		identityFilter: false,
		flags: { isDev: false, isRemovable: false }
	}
}

export const useAppsLoaderStore = defineStore("appLoader", () => {
	const apps = ref<AppInfo[]>([])
	const $listItems = computed(() =>
		apps.value
			.filter((app) => !!app.app_path_exe)
			.map((app) => appInfoToListItem(app as AppInfo & { app_path_exe: string }))
	)
	const appStateStore = useAppStateStore()
	const $filteredListItems = computed<TListItem[]>(() => {
		return appStateStore.searchTerm.length === 0
			? $listItems.value.slice(0, 30)
			: filterListItem(appStateStore.searchTerm, $listItems.value).slice(0, 30)
	})
	function load() {
		return refreshApplicationsList()
			.then(() => getAllApps())
			.then((_apps) => {
				apps.value = _apps
			})
	}
	function setApps(_apps: AppInfo[]): void {
		apps.value = _apps
	}

	function onSelect(item: TListItem): Promise<void> {
		const platform = $appState.get().platform
		const foundApp = apps.value.find((app) => app.app_desktop_path === item.value)
		if (platform === "macos") {
			if (foundApp?.app_desktop_path) {
				return open(foundApp.app_desktop_path)
			} else {
				warn(`Cannot find app at ${item.value}`)
				ElNotification({
					title: "Error",
					type: "error",
					message: `Cannot find app at ${item.value}`
				})
				return Promise.resolve()
			}
		} else if (platform === "linux") {
			if (foundApp?.app_path_exe) {
				return executeBashScript(foundApp.app_path_exe).then(() => Promise.resolve())
			} else {
				warn(`Cannot find app at ${item.value}`)
				ElNotification({
					title: "Error",
					type: "error",
					message: `Cannot find app at ${item.value}`
				})
				return Promise.resolve()
			}
		} else if (platform === "windows") {
			return open(item.value)
		} else {
			ElNotification({
				title: "Unsupported Platform",
				type: "warning",
				message: `Platform ${platform} is not supported`
			})
			warn(`Unsupported platform: ${platform}`)
			return Promise.resolve()
		}
	}
	return {
		id: uuidv4(),
		extensionName: "Applications",
		apps,
		$listItems,
		$filteredListItems,
		load,
		setApps,
		onSelect
	}
})
