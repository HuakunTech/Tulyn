import { invoke } from "@tauri-apps/api/core"
import { getCurrent } from "@tauri-apps/api/window"
import type { IDb, IFs, ISystem, IToast, IUiIframe, IUiWorker } from "../client"

export interface IUiWorkerServer {
	workerUiRender: IUiWorker["render"]
	workerUiSetScrollLoading: IUiWorker["setScrollLoading"]
	workerUiSetSearchTerm: IUiWorker["setSearchTerm"]
	workerUiSetSearchBarPlaceholder: IUiWorker["setSearchBarPlaceholder"]
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
			return getCurrent().startDragging()
		},
		iframeUiToggleMaximize: () => {
			return getCurrent().toggleMaximize()
		},
		iframeUiInternalToggleMaximize: () => {
			return invoke<void>("plugin:window|internal_toggle_maximize")
		}
	}
}
