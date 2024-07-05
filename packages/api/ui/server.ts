import {
  checkPermission,
  constructClipboardApi,
  constructDialogApi,
  constructFetchApi,
  constructFsApi,
  constructNetworkApi,
  constructNotificationApi,
  constructOsApi,
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
} from "tauri-plugin-jarvis-api/commands"
import type { SystemPermission } from "./api/permissions"
import type { ISystem } from "./client"

export interface ISystemServer {
  systemOpenTrash: ISystem["openTrash"]
  systemEmptyTrash: ISystem["emptyTrash"]
  systemShutdown: ISystem["shutdown"]
  systemReboot: ISystem["reboot"]
  systemSleep: ISystem["sleep"]
  systemToggleSystemAppearance: ISystem["toggleSystemAppearance"]
  systemShowDesktop: ISystem["showDesktop"]
  systemQuitAllApps: ISystem["quitAllApps"]
  systemSleepDisplays: ISystem["sleepDisplays"]
  systemSetVolume: ISystem["setVolume"]
  systemSetVolumeTo0: ISystem["setVolumeTo0"]
  systemSetVolumeTo25: ISystem["setVolumeTo25"]
  systemSetVolumeTo50: ISystem["setVolumeTo50"]
  systemSetVolumeTo75: ISystem["setVolumeTo75"]
  systemSetVolumeTo100: ISystem["setVolumeTo100"]
  systemTurnVolumeUp: ISystem["turnVolumeUp"]
  systemTurnVolumeDown: ISystem["turnVolumeDown"]
  systemToggleStageManager: ISystem["toggleStageManager"]
  systemToggleBluetooth: ISystem["toggleBluetooth"]
  systemToggleHiddenFiles: ISystem["toggleHiddenFiles"]
  systemEjectAllDisks: ISystem["ejectAllDisks"]
  systemLogoutUser: ISystem["logoutUser"]
  systemToggleMute: ISystem["toggleMute"]
  systemMute: ISystem["mute"]
  systemUnmute: ISystem["unmute"]
  systemGetFrontmostApp: ISystem["getFrontmostApp"]
  systemHideAllAppsExceptFrontmost: ISystem["hideAllAppsExceptFrontmost"]
  systemGetSelectedFilesInFileExplorer: ISystem["getSelectedFilesInFileExplorer"]
}

export type IJarvisFullAPI = IFullAPI & ISystemServer

export function constructSystemApi(permissions: SystemPermission[]): ISystemServer {
  return {
    systemOpenTrash: checkPermission<SystemPermission>([], permissions)(openTrash),
    systemEmptyTrash: checkPermission<SystemPermission>([], permissions)(emptyTrash),
    systemShutdown: checkPermission<SystemPermission>([], permissions)(shutdown),
    systemReboot: checkPermission<SystemPermission>([], permissions)(reboot),
    systemSleep: checkPermission<SystemPermission>([], permissions)(sleep),
    systemToggleSystemAppearance: checkPermission<SystemPermission>(
      [],
      permissions
    )(toggleSystemAppearance),
    systemShowDesktop: checkPermission<SystemPermission>([], permissions)(showDesktop),
    systemQuitAllApps: checkPermission<SystemPermission>([], permissions)(quitAllApps),
    systemSleepDisplays: checkPermission<SystemPermission>([], permissions)(sleepDisplays),
    systemSetVolume: checkPermission<SystemPermission>([], permissions)(setVolume),
    systemSetVolumeTo0: checkPermission<SystemPermission>([], permissions)(setVolumeTo0),
    systemSetVolumeTo25: checkPermission<SystemPermission>([], permissions)(setVolumeTo25),
    systemSetVolumeTo50: checkPermission<SystemPermission>([], permissions)(setVolumeTo50),
    systemSetVolumeTo75: checkPermission<SystemPermission>([], permissions)(setVolumeTo75),
    systemSetVolumeTo100: checkPermission<SystemPermission>([], permissions)(setVolumeTo100),
    systemTurnVolumeUp: checkPermission<SystemPermission>([], permissions)(turnVolumeUp),
    systemTurnVolumeDown: checkPermission<SystemPermission>([], permissions)(turnVolumeDown),
    systemToggleStageManager: checkPermission<SystemPermission>(
      [],
      permissions
    )(toggleStageManager),
    systemToggleBluetooth: checkPermission<SystemPermission>([], permissions)(toggleBluetooth),
    systemToggleHiddenFiles: checkPermission<SystemPermission>([], permissions)(toggleHiddenFiles),
    systemEjectAllDisks: checkPermission<SystemPermission>([], permissions)(ejectAllDisks),
    systemLogoutUser: checkPermission<SystemPermission>([], permissions)(logoutUser),
    systemToggleMute: checkPermission<SystemPermission>([], permissions)(toggleMute),
    systemMute: checkPermission<SystemPermission>([], permissions)(mute),
    systemUnmute: checkPermission<SystemPermission>([], permissions)(unmute),
    systemGetFrontmostApp: checkPermission<SystemPermission>([], permissions)(getFrontmostApp),
    systemHideAllAppsExceptFrontmost: checkPermission<SystemPermission>(
      [],
      permissions
    )(hideAllAppsExceptFrontmost),
    systemGetSelectedFilesInFileExplorer: checkPermission<SystemPermission>(
      [],
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

export type AllJarvisPermission = AllPermission | SystemPermission

export function constructJarvisServerAPIWithPermissions(
  permissions: AllJarvisPermission[]
): IFullAPI {
  const apis = [
    constructClipboardApi(
      permissions.filter((p) => p.startsWith("clipboard:")) as ClipboardPermission[]
    ),
    constructDialogApi(permissions.filter((p) => p.startsWith("dialog:")) as DialogPermission[]),
    constructNotificationApi(
      permissions.filter((p) => p.startsWith("notification:")) as NotificationPermission[]
    ),
    constructFsApi(permissions.filter((p) => p.startsWith("fs:")) as FsPermission[]),
    constructOsApi(permissions.filter((p) => p.startsWith("os:")) as OsPermission[]),
    constructShellApi(permissions.filter((p) => p.startsWith("shell:")) as ShellPermission[]),
    constructFetchApi(permissions.filter((p) => p.startsWith("fetch:")) as FetchPermission[]),
    constructSystemInfoApi(
      permissions.filter((p) => p.startsWith("system-info:")) as SystemInfoPermission[]
    ),
    constructNetworkApi(permissions.filter((p) => p.startsWith("network:")) as NetworkPermission[]),
    constructUpdownloadApi(
      permissions.filter((p) => p.startsWith("updownload:")) as UpdownloadPermission[]
    ),
    constructSystemApi(permissions.filter((p) => p.startsWith("system:")) as SystemPermission[])
  ]
  return Object.assign({}, ...apis)
}
