import type { IEventServer, IFsServer, ISystemServer } from "../ui/server/server-types"
import type { EventPermission, KunkunFsPermission, SystemPermission } from "./schema"

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

export const SystemPermissionMap: Record<keyof ISystemServer, SystemPermission[]> = {
	systemOpenTrash: [],
	systemEmptyTrash: ["system:fs"],
	systemShutdown: ["system:boot"],
	systemReboot: ["system:boot"],
	systemSleep: ["system:boot"],
	systemToggleSystemAppearance: ["system:ui"],
	systemShowDesktop: ["system:ui"],
	systemQuitAllApps: ["system:apps"],
	systemSleepDisplays: ["system:boot"],
	systemSetVolume: ["system:volumn"],
	systemSetVolumeTo0: ["system:volumn"],
	systemSetVolumeTo25: ["system:volumn"],
	systemSetVolumeTo50: ["system:volumn"],
	systemSetVolumeTo75: ["system:volumn"],
	systemSetVolumeTo100: ["system:volumn"],
	systemTurnVolumeUp: ["system:volumn"],
	systemTurnVolumeDown: ["system:volumn"],
	systemToggleStageManager: ["system:ui"],
	systemToggleBluetooth: [],
	systemToggleHiddenFiles: ["system:ui"],
	systemEjectAllDisks: ["system:disk"],
	systemLogoutUser: ["system:boot"],
	systemToggleMute: ["system:volumn"],
	systemMute: ["system:volumn"],
	systemUnmute: ["system:volumn"],
	systemGetFrontmostApp: ["system:apps"],
	systemHideAllAppsExceptFrontmost: ["system:apps"],
	systemGetSelectedFilesInFileExplorer: ["system:fs"]
}

export const EventPermissionMap: Record<keyof IEventServer, EventPermission[]> = {
	eventOnDragDrop: ["event:drag-drop"],
	eventOnDragEnter: ["event:drag-enter"],
	eventOnDragLeave: ["event:drag-leave"],
	eventOnDragOver: ["event:drag-over"],
	eventOnWindowBlur: ["event:window-blur"],
	eventOnWindowCloseRequested: ["event:window-close-requested"],
	eventOnWindowFocus: ["event:window-focus"]
}
