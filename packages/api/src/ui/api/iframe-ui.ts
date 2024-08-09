import { getDefaultClientAPI } from "tauri-api-adapter"
import { os } from "tauri-api-adapter/iframe"
import { type IUiIframe } from "../client"
import type { IUiIframeServer } from "../server"

const defaultClientAPI = getDefaultClientAPI<IUiIframeServer>()

// export const comlinkUI: IUiIframe = getDefaultClientAPI<IUiIframe>()
// comlinkUI.startDragging = defaultClientAPI.iframeUiStartDragging
// comlinkUI.internalToggleMaximize = defaultClientAPI.iframeUiInternalToggleMaximize
// comlinkUI.toggleMaximize = defaultClientAPI.iframeUiToggleMaximize
export const comlinkUI: IUiIframe = {
	goHome: defaultClientAPI.iframeUiGoHome,
	goBack: defaultClientAPI.iframeUiGoBack,
	hideBackButton: defaultClientAPI.iframeUiHideBackButton,
	hideMoveButton: defaultClientAPI.iframeUiHideMoveButton,
	hideRefreshButton: defaultClientAPI.iframeUiHideRefreshButton,
	showBackButton: defaultClientAPI.iframeUiShowBackButton,
	showMoveButton: defaultClientAPI.iframeUiShowMoveButton,
	showRefreshButton: defaultClientAPI.iframeUiShowRefreshButton,
	getTheme: defaultClientAPI.iframeUiGetTheme,
	reloadPage: defaultClientAPI.iframeUiReloadPage,
	toggleMaximize: defaultClientAPI.iframeUiToggleMaximize,
	startDragging: defaultClientAPI.iframeUiStartDragging,
	internalToggleMaximize: defaultClientAPI.iframeUiInternalToggleMaximize,
	setTransparentWindowBackground: defaultClientAPI.iframeSetTransparentWindowBackground
}

export const KK_DRAG_REGION_ATTR = "kunkun-drag-region"

/**
 * https://github.com/tauri-apps/tauri/blob/e1776946ad034d7a6e005834a754773671d9f7ef/core/tauri/src/window/scripts/drag.js#L13
 */
export async function registerDragRegion(): Promise<void> {
	const osName = await os.platform()
	let x = 0
	let y = 0

	document.addEventListener("mousedown", (e) => {
		const target = e.target as HTMLElement
		if (
			// element has the magic data attribute
			(target.classList.contains(KK_DRAG_REGION_ATTR) ||
				target.hasAttribute(KK_DRAG_REGION_ATTR)) &&
			// and was left mouse button
			e.button === 0 &&
			// and was normal click to drag or double click to maximize
			(e.detail === 1 || e.detail === 2)
		) {
			// macOS maximization happens on `mouseup`,
			// so we save needed state and early return
			if (osName === "macos" && e.detail == 2) {
				x = e.clientX
				y = e.clientY
				return
			}

			// prevents text cursor
			e.preventDefault()

			// fix #2549: double click on drag region edge causes content to maximize without window sizing change
			// https://github.com/tauri-apps/tauri/issues/2549#issuecomment-1250036908
			e.stopImmediatePropagation()

			// start dragging if the element has a `tauri-drag-region` data attribute and maximize on double-clicking it
			// const cmd = e.detail === 2 ? "internal_toggle_maximize" : "start_dragging"
			if (e.detail === 2) {
				comlinkUI.internalToggleMaximize()
			} else {
				comlinkUI.startDragging()
			}
			// window.__TAURI_INTERNALS__.invoke("plugin:window|" + cmd)
		}
	})

	if (osName === "macos") {
		document.addEventListener("mouseup", (e) => {
			const target = e.target as HTMLElement
			if (
				// element has the magic data attribute
				(target.classList.contains(KK_DRAG_REGION_ATTR) ||
					target.hasAttribute(KK_DRAG_REGION_ATTR)) &&
				// target.hasAttribute(KK_DRAG_REGION_ATTR) &&
				// and was left mouse button
				e.button === 0 &&
				// and was double click
				e.detail === 2 &&
				// and the cursor hasn't moved from initial mousedown
				e.clientX === x &&
				e.clientY === y
			) {
				// window.__TAURI_INTERNALS__.invoke("plugin:window|internal_toggle_maximize")
				comlinkUI.internalToggleMaximize()
			}
		})
	}
}
