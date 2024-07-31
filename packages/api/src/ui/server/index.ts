import {
	checkPermission,
	constructClipboardApi,
	constructDialogApi,
	constructEventApi,
	constructFetchApi,
	// constructFsApi, // a local constructFsApi is defined below
	constructLoggerApi,
	constructNetworkApi,
	constructNotificationApi,
	constructOsApi,
	constructPathApi,
	constructShellApi,
	constructSystemInfoApi,
	constructUpdownloadApi,
	type AllPermission,
	type ClipboardPermission,
	type DialogPermission,
	type FetchPermission,
	type FsPermission,
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
	type FsPermissionScoped,
	type KunkunFsPermission,
	type SystemPermission
} from "../api/permissions"
import type { IDbServer } from "./db"
import { constructFsApi, type IFsServer } from "./fs"
import { constructSystemApi, type ISystemServer } from "./system"
import { constructToastApi, type IToastServer } from "./toast"
import { constructIframeUiApi, type IUiIframeServer, type IUiWorkerServer } from "./ui"

export type { IDbServer } from "./db"
export { constructFsApi, type IFsServer } from "./fs"
export { constructSystemApi, type ISystemServer } from "./system"
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
	permissions: (AllKunkunPermission | FsPermissionScoped)[]
): AllKunkunPermission[] {
	return permissions.filter((p) => typeof p === "string") as AllKunkunPermission[]
}

function getObjectPermissions(
	permissions: (AllKunkunPermission | FsPermissionScoped)[]
): FsPermissionScoped[] {
	return permissions.filter((p) => typeof p !== "string") as FsPermissionScoped[]
}

export function constructJarvisServerAPIWithPermissions(
	permissions: (AllKunkunPermission | FsPermissionScoped)[]
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
		constructFsApi(getObjectPermissions(permissions).filter((p) => p.permission.startsWith("fs:"))),
		// constructFsApi(permissions.filter((p) => p.startsWith("fs:")) as FsPermission[]),
		constructOsApi(
			getStringPermissions(permissions).filter((p) => p.startsWith("os:")) as OsPermission[]
		),
		constructShellApi(
			getStringPermissions(permissions).filter((p) => p.startsWith("shell:")) as ShellPermission[]
		),
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
		constructEventApi(),
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
