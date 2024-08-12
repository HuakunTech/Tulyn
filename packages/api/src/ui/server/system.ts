import { checkPermission } from "tauri-api-adapter"
import {
	ejectAllDisks,
	emptyTrash,
	getFrontmostApp,
	getSelectedFilesInFileExplorer,
	hideAllAppsExceptFrontmost,
	logoutUser,
	mute,
	openTrash,
	quitAllApps,
	reboot,
	setVolume,
	setVolumeTo0,
	setVolumeTo25,
	setVolumeTo50,
	setVolumeTo75,
	setVolumeTo100,
	showDesktop,
	shutdown,
	sleep,
	sleepDisplays,
	toggleBluetooth,
	toggleHiddenFiles,
	toggleMute,
	toggleStageManager,
	toggleSystemAppearance,
	turnVolumeDown,
	turnVolumeUp,
	unmute
} from "../../commands/system"
import {
	AllKunkunPermission,
	type FsPermissionScoped,
	type KunkunFsPermission,
	type SystemPermission
} from "../../permissions"
import { SystemPermissionMap } from "../../permissions/permission-map"
import type { ISystemServer } from "./server-types"

export function constructSystemApi(permissions: SystemPermission[]): ISystemServer {
	return {
		systemOpenTrash: checkPermission<SystemPermission>(
			SystemPermissionMap.systemOpenTrash,
			permissions
		)(openTrash),
		systemEmptyTrash: checkPermission<SystemPermission>(
			SystemPermissionMap.systemEmptyTrash,
			permissions
		)(emptyTrash),
		systemShutdown: checkPermission<SystemPermission>(
			SystemPermissionMap.systemShutdown,
			permissions
		)(shutdown),
		systemReboot: checkPermission<SystemPermission>(
			SystemPermissionMap.systemReboot,
			permissions
		)(reboot),
		systemSleep: checkPermission<SystemPermission>(
			SystemPermissionMap.systemSleep,
			permissions
		)(sleep),
		systemToggleSystemAppearance: checkPermission<SystemPermission>(
			SystemPermissionMap.systemToggleSystemAppearance,
			permissions
		)(toggleSystemAppearance),
		systemShowDesktop: checkPermission<SystemPermission>(
			SystemPermissionMap.systemShowDesktop,
			permissions
		)(showDesktop),
		systemQuitAllApps: checkPermission<SystemPermission>(
			SystemPermissionMap.systemQuitAllApps,
			permissions
		)(quitAllApps),
		systemSleepDisplays: checkPermission<SystemPermission>(
			SystemPermissionMap.systemSleepDisplays,
			permissions
		)(sleepDisplays),
		systemSetVolume: checkPermission<SystemPermission>(
			SystemPermissionMap.systemSetVolume,
			permissions
		)(setVolume),
		systemSetVolumeTo0: checkPermission<SystemPermission>(
			SystemPermissionMap.systemSetVolumeTo0,
			permissions
		)(setVolumeTo0),
		systemSetVolumeTo25: checkPermission<SystemPermission>(
			SystemPermissionMap.systemSetVolumeTo25,
			permissions
		)(setVolumeTo25),
		systemSetVolumeTo50: checkPermission<SystemPermission>(
			SystemPermissionMap.systemSetVolumeTo50,
			permissions
		)(setVolumeTo50),
		systemSetVolumeTo75: checkPermission<SystemPermission>(
			SystemPermissionMap.systemSetVolumeTo75,
			permissions
		)(setVolumeTo75),
		systemSetVolumeTo100: checkPermission<SystemPermission>(
			SystemPermissionMap.systemSetVolumeTo100,
			permissions
		)(setVolumeTo100),
		systemTurnVolumeUp: checkPermission<SystemPermission>(
			SystemPermissionMap.systemTurnVolumeUp,
			permissions
		)(turnVolumeUp),
		systemTurnVolumeDown: checkPermission<SystemPermission>(
			SystemPermissionMap.systemTurnVolumeDown,
			permissions
		)(turnVolumeDown),
		systemToggleStageManager: checkPermission<SystemPermission>(
			SystemPermissionMap.systemToggleStageManager,
			permissions
		)(toggleStageManager),
		systemToggleBluetooth: checkPermission<SystemPermission>([], permissions)(toggleBluetooth),
		systemToggleHiddenFiles: checkPermission<SystemPermission>(
			SystemPermissionMap.systemToggleHiddenFiles,
			permissions
		)(toggleHiddenFiles),
		systemEjectAllDisks: checkPermission<SystemPermission>(
			SystemPermissionMap.systemEjectAllDisks,
			permissions
		)(ejectAllDisks),
		systemLogoutUser: checkPermission<SystemPermission>(
			SystemPermissionMap.systemLogoutUser,
			permissions
		)(logoutUser),
		systemToggleMute: checkPermission<SystemPermission>(
			SystemPermissionMap.systemToggleMute,
			permissions
		)(toggleMute),
		systemMute: checkPermission<SystemPermission>(
			SystemPermissionMap.systemMute,
			permissions
		)(mute),
		systemUnmute: checkPermission<SystemPermission>(
			SystemPermissionMap.systemUnmute,
			permissions
		)(unmute),
		systemGetFrontmostApp: checkPermission<SystemPermission>(
			SystemPermissionMap.systemGetFrontmostApp,
			permissions
		)(getFrontmostApp),
		systemHideAllAppsExceptFrontmost: checkPermission<SystemPermission>(
			SystemPermissionMap.systemHideAllAppsExceptFrontmost,
			permissions
		)(hideAllAppsExceptFrontmost),
		systemGetSelectedFilesInFileExplorer: checkPermission<SystemPermission>(
			SystemPermissionMap.systemGetSelectedFilesInFileExplorer,
			permissions
		)(getSelectedFilesInFileExplorer)
	}
}

// all enabled by default
export const defaultSystemApi = constructSystemApi([
	"system:volumn",
	"system:boot",
	"system:disk",
	"system:apps",
	"system:fs"
])
