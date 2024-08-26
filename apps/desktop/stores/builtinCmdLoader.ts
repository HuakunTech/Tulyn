import { DebugWindowLabel, DevWindowLabel, SettingsWindowLabel } from "@/lib/constants"
import { $searchTermSync } from "@/lib/stores/appState"
import { ListItemType, TListItem } from "@/lib/types/list"
import { newSettingsPage } from "@/lib/utils/router"
import { IconType } from "@kksh/api/models"
import { getAllWebviewWindows, WebviewWindow } from "@tauri-apps/api/webviewWindow"
import { filterListItem } from "~/lib/utils/search"
import { ElMessage, ElNotification } from "element-plus"
import { defineStore } from "pinia"
import { v4 as uuidv4 } from "uuid"
import { toast } from "vue-sonner"
import { useAppStateStore } from "./appState"

const localePath = useLocalePath()
const rtConfig = useRuntimeConfig()

type BuiltinCmd = {
	name: string
	description: string
	iconifyIcon: string
	function: () => Promise<void>
}

const builtinCmds: BuiltinCmd[] = [
	{
		name: "Store",
		iconifyIcon: "streamline:store-2-solid",
		description: "Go to Extension Store",
		function: async () => {
			$searchTermSync.set("")
			navigateTo(localePath("/extension-store"))
		}
	},
	{
		name: "Settings",
		iconifyIcon: "solar:settings-linear",
		description: "Open Settings",
		function: async () => {
			const windows = getAllWebviewWindows()
			const found = windows.find((w) => w.label === SettingsWindowLabel)
			if (found) {
				ElNotification.error("Settings Page is already open")
			} else {
				const win = newSettingsPage()
				setTimeout(() => {
					// this is a backup, if window is not properly loaded,
					// the show() will not be called within setting page, we call it here with a larger delay,
					// at least the window will be shown
					win.show()
				}, 800)
			}
			$searchTermSync.set("")
		}
	},
	{
		name: "Reload",
		iconifyIcon: "tabler:reload",
		description: "Reload this page",
		function: async () => {
			location.reload()
		}
	},
	{
		name: "Dance",
		iconifyIcon: "mdi:dance-pole",
		description: "Dance",
		function: async () => {
			navigateTo("/dance")
		}
	},
	{
		name: "Toggle Dev Extension Live Load Mode",
		iconifyIcon: "ri:toggle-line",
		description: "Load dev extensions from their dev server URLs",
		function: async () => {
			const appConfig = useAppConfigStore()
			appConfig.setDevExtLoadUrl(!appConfig.devExtLoadUrl)
			$searchTermSync.set("")
			toast.success(`Dev Extension Live Load Mode toggled to: ${appConfig.devExtLoadUrl}`)
		}
	}
]

if (rtConfig.public.isDev) {
	builtinCmds.push({
		name: "Open Dev Page",
		iconifyIcon: "fa6-brands:dev",
		description: "Open Dev Page",
		function: () => {
			const windows = getAllWebviewWindows()
			const found = windows.find((w) => w.label === DevWindowLabel)
			if (found) {
				ElNotification.error("Debug Page is already open")
			} else {
				new WebviewWindow(DevWindowLabel, {
					url: "/dev",
					width: 1000,
					height: 800
				})
			}
			return Promise.resolve()
		}
	})
	builtinCmds.push({
		name: "Open Debug Page",
		iconifyIcon: "carbon:debug",
		description: "Open Debug Page",
		function: () => {
			const windows = getAllWebviewWindows()
			const found = windows.find((w) => w.label === DebugWindowLabel)
			if (found) {
				ElNotification.error("Debug Page is already open")
			} else {
				new WebviewWindow(DebugWindowLabel, {
					url: "/debug",
					width: 1000,
					height: 800,
					titleBarStyle: "overlay"
				})
			}
			return Promise.resolve()
		}
	})
}

function genListItemValue(name: string): string {
	return "builtin:" + name
}

const buildinCmdsListItems: TListItem[] = builtinCmds.map(
	(cmd): TListItem => ({
		title: cmd.name,
		value: genListItemValue(cmd.name),
		description: cmd.description,
		type: ListItemType.enum.BuiltInCmd,
		icon: {
			value: cmd.iconifyIcon,
			type: IconType.enum.Iconify
		},
		flags: { isDev: false, isRemovable: false },
		keywords: ["builtin"],
		identityFilter: true
	})
)

export const useBuiltInCmdStore = defineStore("built-in-cmd-loader", () => {
	function onSelect(item: TListItem): Promise<void> {
		const cmd = builtinCmds.find((cmd) => genListItemValue(cmd.name) === item.value)
		if (cmd) {
			return cmd.function()
		} else {
			ElMessage.error(`Command (${item.title}) not found`)
			return Promise.reject(`Command (${item.title}) not found`)
		}
	}
	const appStateStore = useAppStateStore()
	const $listItems = ref<TListItem[]>([])
	const $filteredListItems = computed<TListItem[]>(() => {
		return appStateStore.searchTerm.length === 0
			? $listItems.value
			: filterListItem(appStateStore.searchTerm, $listItems.value)
	})

	function load() {
		$listItems.value = buildinCmdsListItems
	}

	return {
		id: uuidv4(),
		load,
		extensionName: "Builtin Commands",
		$listItems,
		$filteredListItems,
		onSelect
	}
})
