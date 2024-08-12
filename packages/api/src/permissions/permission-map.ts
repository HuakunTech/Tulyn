import type { IFsServer } from "../ui/server/server-types"
import type { KunkunFsPermission } from "./schema"

/* -------------------------------------------------------------------------- */
/*                                  Re-export                                 */
/* -------------------------------------------------------------------------- */
export {
	ClipboardPermissionMap,
	DialogPermissionMap,
	NotificationPermissionMap,
	// FsPermissionMap,
	OsPermissionMap,
	FetchPermissionMap,
	SystemInfoPermissionMap,
	ShellPermissionMap,
	UpdownloadPermissionMap
} from "tauri-api-adapter/permissions"

export const FsPermissionMap: Record<keyof IFsServer, KunkunFsPermission[]> = {
	fsReadDir: ["fs:read", "fs:read-dir"],
	fsReadFile: ["fs:read"],
	fsReadTextFile: ["fs:read"],
	fsStat: ["fs:stat", "fs:read"],
	fsLstat: ["fs:stat", "fs:read"],
	fsExists: ["fs:exists", "fs:read"],
	fsMkdir: ["fs:write"],
	fsCreate: ["fs:write"],
	fsCopyFile: ["fs:write"],
	fsRemove: ["fs:write"],
	fsRename: ["fs:write"],
	fsTruncate: ["fs:write"],
	fsWriteFile: ["fs:write"],
	fsWriteTextFile: ["fs:write"],
	fsFileSearch: ["fs:search"]
}
