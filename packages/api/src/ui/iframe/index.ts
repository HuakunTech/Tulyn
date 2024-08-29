import { comlinkClipboard as clipboard } from "tauri-api-adapter/api/clipboard"
import { comlinkDialog as dialog } from "tauri-api-adapter/api/dialog"
import { fetch } from "tauri-api-adapter/api/fetch"
import { comlinkLog as log } from "tauri-api-adapter/api/log"
import { comlinkNetwork as network } from "tauri-api-adapter/api/network"
import { comlinkNotification as notification } from "tauri-api-adapter/api/notification"
import { comlinkOs as os } from "tauri-api-adapter/api/os"
import { comlinkPath as path } from "tauri-api-adapter/api/path"
import { comlinkShell as shell } from "tauri-api-adapter/api/shell"
import { comlinkSysInfo as sysInfo } from "tauri-api-adapter/api/system-info"
import { comlinkUpdownload as updownload } from "tauri-api-adapter/api/updownload"
import { db } from "../api/db"
import { comlinkEvent as event } from "../api/event"
import { fs } from "../api/fs"
import { registerDragRegion, comlinkUI as ui } from "../api/iframe-ui"
import { comlinkOpen as open } from "../api/open"
import { comlinkSystem as system } from "../api/system"
import { toast } from "../api/toast"

export { constructJarvisExtDBToServerDbAPI } from "../api/db"
export { registerDragRegion } from "../api/iframe-ui"

export const api = {
	db,
	fetch,
	fs,
	event,
	ui,
	open,
	system,
	toast,
	clipboard,
	dialog,
	log,
	network,
	notification,
	os,
	path,
	shell,
	sysInfo,
	updownload
}

/**
 * Initialize iframe extension
 * Will
 * 1. registerDragRegion
 */
export function initCustomExtension() {
	registerDragRegion()
}

export { type IUiIframe } from "../client"
export { expose, wrap } from "@huakunshen/comlink"
export { type IDbServer } from "../server/db"
export { type IUiIframeServer } from "../server/ui"
