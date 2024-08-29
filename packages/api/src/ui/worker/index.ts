/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */
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
import { comlinkOpen as open } from "../api/open"
import { comlinkSystem as system } from "../api/system"
import { toast } from "../api/toast"
import { comlinkUI as ui } from "../api/worker-ui"

export { constructJarvisExtDBToServerDbAPI } from "../api/db"
export const api = {
	db,
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
	updownload,
	event,
	open,
	system,
	ui,
	fetch,
	fs
}

export { WorkerExtension } from "./ext"
export { expose, wrap } from "@huakunshen/comlink"
export { type IDbServer } from "../server/db"
/* -------------------------------------------------------------------------- */
/*                             UI Component Schema                            */
/* -------------------------------------------------------------------------- */
export { type IComponent } from "./components"
export * as ListSchema from "./schema/list"
export * as FormSchema from "./schema/form"
export { Markdown as MarkdownSchema } from "./schema/markdown"

export { List, Action, Form, Markdown } from "./components"
export * from "../../models/styles"
export { Icon } from "./components/icon"
export { IconEnum, IconType, IconNode } from "../../models/icon"
export * as schema from "./schema"
export { NodeName, NodeNameEnum, FormNodeName, FormNodeNameEnum } from "../../models/constants"
