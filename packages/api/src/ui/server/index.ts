import {
	checkPermission,
	constructClipboardApi,
	constructDialogApi,
	constructFetchApi,
	// constructFsApi, // a local constructFsApi is defined
	constructLoggerApi,
	constructNetworkApi,
	constructNotificationApi,
	constructOsApi,
	constructPathApi,
	// constructShellApi, // a local custom constructShellApi is defined
	constructSystemInfoApi,
	constructUpdownloadApi,
	type ClipboardPermission,
	type DialogPermission,
	type FetchPermission,
	type IFullAPI,
	type NetworkPermission,
	type NotificationPermission,
	type OsPermission,
	type ShellPermission,
	type SystemInfoPermission,
	type UpdownloadPermission
} from "tauri-api-adapter"
import {
	AllKunkunPermission,
	ShellPermissionScoped,
	type EventPermission,
	type FsPermissionScoped,
	type KunkunFsPermission,
	type OpenPermissionScoped,
	type SystemPermission
} from "../../permissions"
import type { IDbServer } from "./db"
import { constructEventApi } from "./event"
import { constructFsApi } from "./fs"
import { constructOpenApi } from "./open"
import type { IFsServer, ISystemServer } from "./server-types"
import { constructShellApi } from "./shell"
import { constructSystemApi } from "./system"
import { constructToastApi, type IToastServer } from "./toast"
import { constructIframeUiApi, type IUiIframeServer, type IUiWorkerServer } from "./ui"

export type { IDbServer } from "./db"
export { constructFsApi } from "./fs"
export { constructSystemApi } from "./system"
export { constructToastApi, type IToastServer } from "./toast"
export { constructIframeUiApi, type IUiIframeServer, type IUiWorkerServer } from "./ui"

export type IJarvisFullAPI = IFullAPI &
	ISystemServer &
	IToastServer &
	IDbServer &
	IUiWorkerServer &
	IUiIframeServer &
	IFsServer // IFsServer will override some methods in IFullAPI, it's fine because it's a superset

function getStringPermissions(
	permissions: (AllKunkunPermission | FsPermissionScoped | OpenPermissionScoped)[]
): AllKunkunPermission[] {
	return permissions.filter((p) => typeof p === "string") as AllKunkunPermission[]
}

function getObjectPermissions(
	permissions: (AllKunkunPermission | FsPermissionScoped | OpenPermissionScoped)[]
): (FsPermissionScoped | OpenPermissionScoped | ShellPermissionScoped)[] {
	return permissions.filter((p) => typeof p !== "string")
}

export function constructJarvisServerAPIWithPermissions(
	permissions: (AllKunkunPermission | FsPermissionScoped | OpenPermissionScoped)[]
): IJarvisFullAPI {
	const apis = [
		constructClipboardApi(
			getStringPermissions(permissions).filter((p) =>
				p.startsWith("clipboard:")
			) as ClipboardPermission[]
		),
		constructDialogApi(
			getStringPermissions(permissions).filter((p) => p.startsWith("dialog:")) as DialogPermission[]
		),
		constructNotificationApi(
			getStringPermissions(permissions).filter((p) =>
				p.startsWith("notification:")
			) as NotificationPermission[]
		),
		constructFsApi(
			(getObjectPermissions(permissions) as FsPermissionScoped[]).filter((p) =>
				p.permission.startsWith("fs:")
			)
		),
		constructOpenApi(
			(getObjectPermissions(permissions) as OpenPermissionScoped[]).filter((p) =>
				p.permission.startsWith("open:")
			)
		),
		constructOsApi(
			getStringPermissions(permissions).filter((p) => p.startsWith("os:")) as OsPermission[]
		),
		constructShellApi([
			...(getStringPermissions(permissions).filter((p) =>
				p.startsWith("shell:")
			) as ShellPermission[]),
			...(getObjectPermissions(permissions) as ShellPermissionScoped[]).filter((p) =>
				p.permission.startsWith("shell:")
			)
		]),
		constructFetchApi(
			getStringPermissions(permissions).filter((p) => p.startsWith("fetch:")) as FetchPermission[]
		),
		constructSystemInfoApi(
			getStringPermissions(permissions).filter((p) =>
				p.startsWith("system-info:")
			) as SystemInfoPermission[]
		),
		constructNetworkApi(
			getStringPermissions(permissions).filter((p) =>
				p.startsWith("network:")
			) as NetworkPermission[]
		),
		constructUpdownloadApi(
			getStringPermissions(permissions).filter((p) =>
				p.startsWith("updownload:")
			) as UpdownloadPermission[]
		),
		constructEventApi(
			getStringPermissions(permissions).filter((p) => p.startsWith("event:")) as EventPermission[]
		), // this one is not from tauri-api-adapter, it's a custom one defined in this project, only limited events are exposed
		constructLoggerApi(),
		constructPathApi(),
		constructSystemApi(
			getStringPermissions(permissions).filter((p) => p.startsWith("system:")) as SystemPermission[]
		),
		constructToastApi(),
		constructIframeUiApi()
	]
	return Object.assign({}, ...apis)
}
