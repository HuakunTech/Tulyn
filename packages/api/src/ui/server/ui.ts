import { invoke } from "@tauri-apps/api/core"
import { getCurrentWindow } from "@tauri-apps/api/window"
import type { IDb, IFs, ISystem, IToast, IUiIframe, IUiWorker } from "../client"

export interface IUiWorkerServer {
	workerUiRender: IUiWorker["render"]
	workerUiSetScrollLoading: IUiWorker["setScrollLoading"]
	workerUiSetSearchTerm: IUiWorker["setSearchTerm"]
	workerUiSetSearchBarPlaceholder: IUiWorker["setSearchBarPlaceholder"]
	workerUiToast: IUiWorker["toast"]
}

export interface IUiIframeServer {
	iframeUiGoHome: IUiIframe["goHome"]
	iframeUiGoBack: IUiIframe["goBack"]
	iframeUiHideBackButton: IUiIframe["hideBackButton"]
	iframeUiHideMoveButton: IUiIframe["hideMoveButton"]
	iframeUiHideRefreshButton: IUiIframe["hideRefreshButton"]
	iframeUiShowBackButton: IUiIframe["showBackButton"]
	iframeUiShowMoveButton: IUiIframe["showMoveButton"]
	iframeUiShowRefreshButton: IUiIframe["showRefreshButton"]
	iframeUiGetTheme: IUiIframe["getTheme"]
	iframeUiReloadPage: IUiIframe["reloadPage"]
	iframeUiStartDragging: IUiIframe["startDragging"]
	iframeUiToggleMaximize: IUiIframe["toggleMaximize"]
	iframeUiInternalToggleMaximize: IUiIframe["internalToggleMaximize"]
	iframeSetTransparentWindowBackground: IUiIframe["setTransparentWindowBackground"]
}

/**
 * Other APIs will be constructed in main window as they are used to manipulate UI directly
 * We can't access UI from here
 * @returns
 */
export function constructIframeUiApi(): Pick<
	IUiIframeServer,
	"iframeUiStartDragging" | "iframeUiToggleMaximize" | "iframeUiInternalToggleMaximize"
> {
	return {
		iframeUiStartDragging: () => {
			console.log("iframeUiStartDragging in server ui API")
			return getCurrentWindow().startDragging()
		},
		iframeUiToggleMaximize: () => {
			return getCurrentWindow().toggleMaximize()
		},
		iframeUiInternalToggleMaximize: () => {
			return invoke<void>("plugin:window|internal_toggle_maximize")
		}
	}
}
