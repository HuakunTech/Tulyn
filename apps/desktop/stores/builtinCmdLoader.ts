import { DebugWindowLabel, DevWindowLabel, SettingsWindowLabel } from "@/lib/constants"
import { ListItemType, ListItemTypeEnum, TListItem } from "@/lib/types/list"
import { newSettingsPage } from "@/lib/utils/router"
import { IconType } from "@kksh/api/models"
import { getAllWebviewWindows, WebviewWindow } from "@tauri-apps/api/webviewWindow"
import { filterListItem } from "~/lib/utils/search"
import { checkUpdateAndInstall } from "~/lib/utils/updater"
import { ElMessage, ElNotification } from "element-plus"
import { defineStore } from "pinia"
import { v4 as uuidv4 } from "uuid"
import { toast } from "vue-sonner"
import { useAppStateStore } from "./appState"
import type { IExtensionLoader } from "./types"

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
			const appStateStore = useAppStateStore()
			appStateStore.setSearchTermSync("")
			navigateTo("/extension-store")
		}
	},
	{
		name: "Sign In",
		iconifyIcon: "mdi:login-variant",
		description: "",
		function: async () => {
			navigateTo("/auth")
		}
	},
	{
		name: "Sign Out",
		iconifyIcon: "mdi:logout-variant",
		description: "",
		function: async () => {
			const supabase = useSupabaseClient()
			supabase.auth.signOut()
		}
	},
	{
		name: "Show Draggable Area",
		iconifyIcon: "mingcute:move-fill",
		description: "",
		function: async () => {
			// select all html elements with attribute data-tauri-drag-region
			const elements = document.querySelectorAll("[data-tauri-drag-region]")
			console.log(elements)

			elements.forEach((el) => {
				el.classList.add("bg-red-500/30")
			})
			setTimeout(() => {
				elements.forEach((el) => {
					el.classList.remove("bg-red-500/30")
				})
			}, 2_000)
		}
	},
	{
		name: "Add Dev Extension",
		iconifyIcon: "lineicons:dev",
		description: "",
		function: async () => {
			const appStateStore = useAppStateStore()
			appStateStore.setSearchTermSync("")
			navigateTo("/add-dev-ext")
		}
	},
	{
		name: "Set Dev Extension Path",
		iconifyIcon: "lineicons:dev",
		description: "",
		function: async () => {
			const appStateStore = useAppStateStore()
			appStateStore.setSearchTermSync("")
			navigateTo("/set-dev-ext-path")
		}
	},
	{
		name: "Window Troubleshooter",
		iconifyIcon: "material-symbols:window-outline",
		description: "",
		function: async () => {
			const appStateStore = useAppStateStore()
			appStateStore.setSearchTermSync("")
			// navigateTo("/window-troubleshooter")
			const winLabel = `main:window-troubleshooter-${uuidv4()}`
			console.log(winLabel)
			new WebviewWindow(winLabel, {
				url: "/window-troubleshooter",
				title: "Window Troubleshooter"
			})
		}
	},
	{
		name: "Extension Permission Inspector",
		iconifyIcon: "hugeicons:inspect-code",
		description: "",
		function: async () => {
			const appStateStore = useAppStateStore()
			appStateStore.setSearchTermSync("")
			navigateTo("/ext-permission-inspector")
		}
	},
	{
		name: "Extension Loading Troubleshooter",
		iconifyIcon: "material-symbols:troubleshoot",
		description: "",
		function: async () => {
			const appStateStore = useAppStateStore()
			appStateStore.setSearchTermSync("")
			navigateTo("/extension-load-troubleshooter")
		}
	},
	{
		name: "Create Quicklink",
		iconifyIcon: "material-symbols:link",
		description: "Create a Quicklink",
		function: async () => {
			const appStateStore = useAppStateStore()
			appStateStore.setSearchTermSync("")
			navigateTo("/create-quicklink")
		}
	},
	{
		name: "Settings",
		iconifyIcon: "solar:settings-linear",
		description: "Open Settings",
		function: async () => {
			const windows = await getAllWebviewWindows()
			const found = windows.find((w) => w.label === SettingsWindowLabel)
			if (found) {
				ElNotification.error("Settings Page is already open")
			} else {
				const win = await newSettingsPage()
				setTimeout(() => {
					// this is a backup, if window is not properly loaded,
					// the show() will not be called within setting page, we call it here with a larger delay,
					// at least the window will be shown
					win.show()
				}, 800)
			}
			const appStateStore = useAppStateStore()
			appStateStore.setSearchTermSync("")
		}
	},
	{
		name: "Check Update",
		iconifyIcon: "material-symbols:update",
		description: "Check for updates",
		function: async () => {
			checkUpdateAndInstall()
		}
	},
	{
		name: "Check Beta Update",
		iconifyIcon: "material-symbols:update",
		description: "Check for Beta updates",
		function: async () => {
			checkUpdateAndInstall(true)
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
			const appStateStore = useAppStateStore()
			appStateStore.setSearchTermSync("")
			toast.success(`Dev Extension Live Load Mode toggled to: ${appConfig.devExtLoadUrl}`)
		}
	},
	{
		name: "Toggle Hide On Blur",
		iconifyIcon: "ri:toggle-line",
		description: "Toggle Hide On Blur",
		function: async () => {
			const appConfig = useAppConfigStore()
			appConfig.setHideOnBlur(!appConfig.hideOnBlur)
			const appStateStore = useAppStateStore()
			appStateStore.setSearchTermSync("")
			toast.success(`"Hide on Blur" toggled to: ${appConfig.hideOnBlur}`)
		}
	}
]

if (rtConfig.public.isDev) {
	builtinCmds.push({
		name: "Open Dev Page",
		iconifyIcon: "fa6-brands:dev",
		description: "Open Dev Page",
		function: async () => {
			navigateTo("/dev")
			return
			const windows = await getAllWebviewWindows()
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
		function: async () => {
			const windows = await getAllWebviewWindows()
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
		value: {
			type: ListItemTypeEnum.BuiltInCmd,
			data: "builtin:" + cmd.name
		},
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
		const cmd = builtinCmds.find((cmd) => genListItemValue(cmd.name) === item.value.data)
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

	async function load() {
		$listItems.value = buildinCmdsListItems
	}

	return {
		id: uuidv4(),
		load,
		extensionName: "Builtin Commands",
		$listItems,
		$filteredListItems,
		onSelect
	} satisfies IExtensionLoader
})
