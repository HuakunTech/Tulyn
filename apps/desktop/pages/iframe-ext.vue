<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { db, JarvisExtDB } from "@kksh/api/commands"
import { CustomPosition, LightMode, Radius, ThemeColor, type Position } from "@kksh/api/models"
import { constructJarvisServerAPIWithPermissions, exposeApiToWindow } from "@kksh/api/ui"
import {
	constructJarvisExtDBToServerDbAPI,
	type IDbServer,
	type IUiIframeServer
} from "@kksh/api/ui/iframe"
import { getCurrent } from "@tauri-apps/api/window"
import { cn } from "~/lib/utils"
import { isInMainWindow } from "~/lib/utils/window"
import { ArrowLeftIcon, MoveIcon, RefreshCcwIcon } from "lucide-vue-next"
import { flatten, safeParse } from "valibot"
import { toast } from "vue-sonner"
import { useExtStore } from "../stores/ext"

const appConfig = useAppConfigStore()
const ui = reactive<{
	iframeLoaded: boolean
	showBackBtn: boolean
	showMoveBtn: boolean
	showRefreshBtn: boolean
	backBtnPosition: Position
	moveBtnPosition: Position
	refreshBtnPosition: Position
}>({
	iframeLoaded: false,
	showBackBtn: isInMainWindow(), // if open in new window, hide back button
	showMoveBtn: true,
	showRefreshBtn: true,
	backBtnPosition: "top-left",
	moveBtnPosition: "bottom-left",
	refreshBtnPosition: "top-right"
})
const iframeRef = ref<HTMLIFrameElement | null>(null)
const extStore = useExtStore()
const iframeUiAPI: Omit<
	IUiIframeServer,
	"iframeUiStartDragging" | "iframeUiToggleMaximize" | "iframeUiInternalToggleMaximize"
> = {
	iframeUiGoHome: async () => {
		navigateTo("/")
	},
	iframeUiGoBack: async () => {
		history.back()
	},
	iframeUiHideBackButton: async () => {
		ui.showBackBtn = false
	},
	iframeUiHideMoveButton: async () => {
		ui.showMoveBtn = false
	},
	iframeUiHideRefreshButton: async () => {
		ui.showRefreshBtn = false
	},
	iframeUiShowBackButton: async (position?: Position) => {
		if (isInMainWindow()) {
			return // if open in new window, hide back button
		}
		ui.showBackBtn = true
		ui.backBtnPosition = position ?? "top-left"
	},
	iframeUiShowMoveButton: async (position?: Position) => {
		ui.showMoveBtn = true
		ui.moveBtnPosition = position ?? "bottom-left"
	},
	iframeUiShowRefreshButton: async (position?: Position) => {
		ui.showRefreshBtn = true
		ui.refreshBtnPosition = position ?? "top-right"
	},
	iframeUiGetTheme: () => {
		return Promise.resolve({
			theme: appConfig.theme as ThemeColor,
			radius: appConfig.radius as Radius,
			lightMode: appConfig.lightMode as LightMode
		})
	},
	async iframeUiReloadPage() {
		location.reload()
	}
}

onMounted(async () => {
	// navigateTo("/")
	setTimeout(() => {
		getCurrent().show()
	}, 200)
	if (!extStore.currentCustomUiExt) {
		return navigateTo("/")
	}
	const currentCustomUiExt = extStore.currentCustomUiExt
	const extInfoInDB = await db.getExtensionByIdentifier(
		currentCustomUiExt.manifest.kunkun.identifier
	)
	if (!extInfoInDB) {
		toast.error("Unexpected Error", {
			description: `Worker extension ${currentCustomUiExt.manifest.kunkun.identifier} not found in database. Run Troubleshooter.`
		})
		return navigateTo("/")
	}
	const dbAPI = new db.JarvisExtDB(extInfoInDB.extId)
	const extDBApi: IDbServer = constructJarvisExtDBToServerDbAPI(dbAPI)
	if (iframeRef.value && iframeRef.value.contentWindow) {
		const serverAPI = constructJarvisServerAPIWithPermissions(
			currentCustomUiExt.manifest.kunkun.permissions
		)
		console.log("serverAPI", serverAPI)

		exposeApiToWindow(iframeRef.value.contentWindow as Window, {
			...serverAPI,
			...iframeUiAPI,
			...extDBApi
		})
	} else {
		console.error("iframeRef not available")
	}
})

function onIframeLoad() {
	setTimeout(() => {
		console.log("iframe loaded", iframeRef.value)

		// avoid flickering, especially on slow connections and dark mode
		ui.iframeLoaded = true
		// if (iframeRef.value) {
		// 	;(iframeRef.value.contentWindow as Window & typeof globalThis).eval(`

		// 	`)
		// }
	}, 200)
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
</script>
<template>
	<main class="h-screen">
		<Button
			v-if="ui.showBackBtn"
			:class="cn('absolute', positionToTailwindClasses(ui.backBtnPosition))"
			:style="positionToCssStyleObj(ui.backBtnPosition)"
			size="icon"
			variant="outline"
			@click="navigateTo('/')"
		>
			<ArrowLeftIcon class="w-4" />
		</Button>
		<Button
			v-if="ui.showMoveBtn"
			data-tauri-drag-region
			:class="cn('absolute', positionToTailwindClasses(ui.moveBtnPosition))"
			:style="positionToCssStyleObj(ui.moveBtnPosition)"
			size="icon"
			variant="outline"
		>
			<MoveIcon data-tauri-drag-region class="w-4" />
		</Button>
		<Button
			v-if="ui.showRefreshBtn"
			:class="cn('absolute', positionToTailwindClasses(ui.refreshBtnPosition))"
			:style="positionToCssStyleObj(ui.refreshBtnPosition)"
			size="icon"
			variant="outline"
			@click="iframeUiAPI.iframeUiReloadPage"
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
			:src="extStore.currentCustomUiExt?.url"
		/>
		<FunDance v-show="!ui.iframeLoaded" />
	</main>
</template>
