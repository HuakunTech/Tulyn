/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */
export {
	clipboard,
	dialog,
	event,
	network,
	fs,
	notification,
	os,
	shell,
	sysInfo,
	path,
	log,
	updownload,
	fetch
} from "tauri-api-adapter"
export { constructJarvisServerAPIWithPermissions } from "./server"
export { type IUiWorkerServer, type IUiIframeServer } from "./server/ui"
export type { IUiWorker, IUiIframe } from "./client"
export { expose, wrap } from "@huakunshen/comlink"
export { getWorkerApiClient, exposeApiToWorker, exposeApiToWindow } from "tauri-api-adapter"
