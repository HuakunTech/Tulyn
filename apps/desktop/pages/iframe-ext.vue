<script setup lang="ts">
import { db } from "@kksh/api/commands"
import {
	CustomPosition,
	ExtPackageJsonExtra,
	LightMode,
	Radius,
	ThemeColor,
	type Position
} from "@kksh/api/models"
import { constructJarvisServerAPIWithPermissions, exposeApiToWindow } from "@kksh/api/ui"
import { type IUiIframeServer2 } from "@kksh/api/ui/iframe"
import { Button } from "@kksh/vue/button"
import { join } from "@tauri-apps/api/path"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { error, warn } from "@tauri-apps/plugin-log"
import { loadExtensionManifestFromDisk } from "~/lib/commands/extensions"
import { cn } from "~/lib/utils"
import { sendNotificationWithPermission } from "~/lib/utils/notification"
import { isInMainWindow } from "~/lib/utils/window"
import { ArrowLeftIcon, MoveIcon, RefreshCcwIcon, XIcon } from "lucide-vue-next"
import { flatten, safeParse } from "valibot"
import * as v from "valibot"
import { toast } from "vue-sonner"
import { useExtDisplayStore } from "../stores/extState"

const localePath = useLocalePath()
const appConfig = useAppConfigStore()
const ui = reactive<{
	iframeLoaded: boolean
	showBackBtn: boolean
	showMoveBtn: boolean
	showRefreshBtn: boolean
	backBtnPosition: Position
	moveBtnPosition: Position
	refreshBtnPosition: Position
	transparentBg: boolean
}>({
	iframeLoaded: false,
	showBackBtn: true, // if open in new window, hide back button
	showMoveBtn: true,
	showRefreshBtn: true,
	backBtnPosition: "top-left",
	moveBtnPosition: "bottom-left",
	refreshBtnPosition: "top-right",
	transparentBg: false
})
const appWin = getCurrentWindow()
const iframeRef = ref<HTMLIFrameElement | null>(null)
const extStore = useExtDisplayStore()
const extUrl = ref<string>()
const loadedExt = ref<ExtPackageJsonExtra>()
let allExposedApis: Record<string, any> = {}
const iframeUiAPI: IUiIframeServer2 = {
	// async iframeUiStartDragging() {
	// 	console.log("start dragging")
	// 	appWin.startDragging().catch(console.error)
	// },
	// iframeUiGoHome: async () => {
	// 	navigateTo(localePath("/"))
	// },
	goBack: async () => {
		if (isInMainWindow()) {
			navigateTo(localePath("/"))
		} else {
			appWin.close()
		}
	},
	hideBackButton: async () => {
		ui.showBackBtn = false
	},
	hideMoveButton: async () => {
		ui.showMoveBtn = false
	},
	hideRefreshButton: async () => {
		ui.showRefreshBtn = false
	},
	showBackButton: async (position?: Position) => {
		ui.showBackBtn = true
		ui.backBtnPosition = position ?? "top-left"
	},
	showMoveButton: async (position?: Position) => {
		ui.showMoveBtn = true
		ui.moveBtnPosition = position ?? "bottom-left"
	},
	showRefreshButton: async (position?: Position) => {
		ui.showRefreshBtn = true
		ui.refreshBtnPosition = position ?? "top-right"
	},
	getTheme: () => {
		return Promise.resolve({
			theme: appConfig.theme as ThemeColor,
			radius: appConfig.radius as Radius,
			lightMode: appConfig.lightMode as LightMode
		})
	},
	async reloadPage() {
		location.reload()
	},
	async setTransparentWindowBackground(transparent: boolean) {
		if (isInMainWindow()) {
			throw new Error("Cannot set background in main window")
		}
		if (transparent) {
			document.body.style.backgroundColor = "transparent"
		} else {
			document.body.style.backgroundColor = ""
		}
	}
}

onMounted(async () => {
	setTimeout(() => {
		appWin.show()
	}, 100)
	const route = useRoute()
	console.log(route.query)

	const parseUrl = v.safeParse(v.string(), route.query.url)

	if (!parseUrl.success) {
		sendNotificationWithPermission("Invalid Extension URL", "")
		if (appWin.label !== "main") {
			return appWin.close()
		} else {
			return navigateTo(localePath("/"))
		}
	}
	extUrl.value = parseUrl.output

	const parseExtPath = v.safeParse(v.string(), route.query.extPath)
	if (!parseExtPath.success) {
		sendNotificationWithPermission("Invalid Extension Path", "")
		if (appWin.label !== "main") {
			return appWin.close()
		} else {
			return navigateTo(localePath("/"))
		}
	}
	const extPath = parseExtPath.output
	try {
		loadedExt.value = await loadExtensionManifestFromDisk(await join(extPath, "package.json"))
	} catch (error) {
		console.error("Error loading extension", error)
		sendNotificationWithPermission("Error loading extension", "")
		if (appWin.label !== "main") {
			return appWin.close()
		} else {
			return navigateTo(localePath("/"))
		}
	}
	if (!loadedExt.value) {
		console.error("No loaded extension")
		return
	}
	const identifier = loadedExt.value.kunkun.identifier
	if (!identifier || !extUrl.value) {
		return navigateTo(localePath("/"))
	}
	const extInfoInDB = await db.getExtensionByIdentifier(identifier)
	if (!extInfoInDB) {
		toast.error("Unexpected Error", {
			description: `Worker extension ${identifier} not found in database. Run Troubleshooter.`
			// description: `Worker extension ${currentCustomUiExt.manifest.kunkun.identifier} not found in database. Run Troubleshooter.`
		})
		return navigateTo(localePath("/"))
	}
	const dbAPI = new db.JarvisExtDB(extInfoInDB.extId)
	// const extDBApi: IDbServer = constructJarvisExtDBToServerDbAPI(dbAPI) // TODO
	const serverAPI = constructJarvisServerAPIWithPermissions(loadedExt.value.kunkun.permissions)
	serverAPI.iframeUi = {
		...serverAPI.iframeUi,
		...iframeUiAPI
	}
	allExposedApis = {
		...serverAPI,
		iframeUi: {
			...serverAPI.iframeUi,
			...iframeUiAPI
		},
		db: dbAPI
	}
	// allExposedApis = {
	// 	...serverAPI,
	// 	...iframeUiAPI,
	// 	...extDBApi
	// }
	exposeAPIsToIframe()
	window.addEventListener("message", (event) => {
		if (event.data.type === "RELEASE") {
			console.count("comlink released")
			warn(`comlink released in ${identifier}`)
			// exposeAPIsToIframe() // TODO: This may cause memory leak
		}
	})
})

/**
 * When extension iframe is in production mode, it loads very fast.
 * iframeRef.value may be null when iframe is loaded, so we manually get the iframe element with document API.
 */
function getTheOnlyIframe() {
	return document.querySelector("iframe")
}

async function exposeAPIsToIframe() {
	// console.log("exposing apis to iframe")
	const iframeEle = getTheOnlyIframe()
	// console.log("iframeEle", iframeEle, iframeEle?.contentWindow)

	if (iframeRef.value && iframeRef.value.contentWindow) {
		exposeApiToWindow(iframeRef.value.contentWindow, allExposedApis)
	} else if (iframeEle) {
		exposeApiToWindow(iframeEle.contentWindow!, allExposedApis)
	} else {
		console.error("iframeRef not available", document.querySelector("iframe"))
	}
}

function onIframeLoad() {
	setTimeout(() => {
		// avoid flickering, especially on slow connections and dark mode
		ui.iframeLoaded = true
		// if (iframeRef.value) {
		// 	;(iframeRef.value.contentWindow as Window & typeof globalThis).eval(`

		// 	`)
		// }
	}, 500)
}

function positionToTailwindClasses(position: Position) {
	switch (position) {
		case "top-left":
			return "top-2 left-2"
		case "top-right":
			return "top-2 right-2"
		case "bottom-left":
			return "bottom-2 left-2"
		case "bottom-right":
			return "bottom-2 right-2"
		default:
			return ""
	}
}

function positionToCssStyleObj(position?: Position) {
	if (!position) {
		return {}
	}
	if (typeof position === "string") {
		return {}
	}
	const parseRes = safeParse(CustomPosition, position)
	if (!parseRes.success) {
		return {}
	}
	const customPos = parseRes.output
	const ret: {
		top?: string
		bottom?: string
		left?: string
		right?: string
	} = {}
	if (customPos.bottom != undefined) {
		ret.bottom = `${customPos.bottom}rem`
	}
	if (customPos.top != undefined) {
		ret.top = `${customPos.top}rem`
	}
	if (customPos.left != undefined) {
		ret.left = `${customPos.left}rem`
	}
	if (customPos.right != undefined) {
		ret.right = `${customPos.right}rem`
	}
	return ret
}

function onBackBtnClicked() {
	if (isInMainWindow()) {
		navigateTo(localePath("/"))
	} else {
		appWin.close()
	}
}
</script>
<template>
	<main class="h-screen">
		<Button
			v-if="ui.showBackBtn"
			:class="cn('absolute z-40', positionToTailwindClasses(ui.backBtnPosition))"
			:style="positionToCssStyleObj(ui.backBtnPosition)"
			size="icon"
			variant="outline"
			@click="onBackBtnClicked"
		>
			<ArrowLeftIcon v-if="appWin.label === 'main'" class="w-4" />
			<XIcon v-else class="w-4" />
		</Button>
		<Button
			v-if="ui.showMoveBtn"
			data-tauri-drag-region
			:class="cn('absolute z-40', positionToTailwindClasses(ui.moveBtnPosition))"
			:style="positionToCssStyleObj(ui.moveBtnPosition)"
			size="icon"
			variant="outline"
		>
			<MoveIcon data-tauri-drag-region class="w-4" />
		</Button>
		<Button
			v-if="ui.showRefreshBtn"
			:class="cn('absolute z-40', positionToTailwindClasses(ui.refreshBtnPosition))"
			:style="positionToCssStyleObj(ui.refreshBtnPosition)"
			size="icon"
			variant="outline"
			@click="iframeUiAPI.reloadPage"
		>
			<RefreshCcwIcon class="w-4" />
		</Button>
		<iframe
			v-show="ui.iframeLoaded"
			@load="onIframeLoad"
			ref="iframeRef"
			class="h-full"
			width="100%"
			heigh="100%"
			frameborder="0"
			:src="extUrl"
		/>
		<FunDance v-if="!ui.iframeLoaded" class="-z-30" />
	</main>
</template>
