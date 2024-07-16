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
import { union, type InferOutput } from "valibot"
import { toast } from "vue-sonner"
import {
  AllJarvisPermission,
  SystemPermissionSchema,
  type SystemPermission
} from "./api/permissions"
import type { ISystem } from "./client"
import { ListSchema, type IComponent } from "./worker"

export interface IUiServer {
  render: (view: IComponent<ListSchema.List>) => void
  setScrollLoading: (loading: boolean) => void
}

export interface IToastServer {
  toastMessage: typeof toast.message
  toastInfo: typeof toast.info
  toastSuccess: typeof toast.success
  toastWarning: typeof toast.warning
  toastError: typeof toast.error
}

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

export function constructSystemApi(permissions: SystemPermission[]): ISystemServer {
  return {
    systemOpenTrash: checkPermission<SystemPermission>([], permissions)(openTrash),
    systemEmptyTrash: checkPermission<SystemPermission>(["system:fs"], permissions)(emptyTrash),
    systemShutdown: checkPermission<SystemPermission>(["system:boot"], permissions)(shutdown),
    systemReboot: checkPermission<SystemPermission>(["system:boot"], permissions)(reboot),
    systemSleep: checkPermission<SystemPermission>(["system:boot"], permissions)(sleep),
    systemToggleSystemAppearance: checkPermission<SystemPermission>(
      ["system:ui"],
      permissions
    )(toggleSystemAppearance),
    systemShowDesktop: checkPermission<SystemPermission>(["system:ui"], permissions)(showDesktop),
    systemQuitAllApps: checkPermission<SystemPermission>(["system:apps"], permissions)(quitAllApps),
    systemSleepDisplays: checkPermission<SystemPermission>(
      ["system:boot"],
      permissions
    )(sleepDisplays),
    systemSetVolume: checkPermission<SystemPermission>(["system:volumn"], permissions)(setVolume),
    systemSetVolumeTo0: checkPermission<SystemPermission>(
      ["system:volumn"],
      permissions
    )(setVolumeTo0),
    systemSetVolumeTo25: checkPermission<SystemPermission>(
      ["system:volumn"],
      permissions
    )(setVolumeTo25),
    systemSetVolumeTo50: checkPermission<SystemPermission>(
      ["system:volumn"],
      permissions
    )(setVolumeTo50),
    systemSetVolumeTo75: checkPermission<SystemPermission>(
      ["system:volumn"],
      permissions
    )(setVolumeTo75),
    systemSetVolumeTo100: checkPermission<SystemPermission>(
      ["system:volumn"],
      permissions
    )(setVolumeTo100),
    systemTurnVolumeUp: checkPermission<SystemPermission>(
      ["system:volumn"],
      permissions
    )(turnVolumeUp),
    systemTurnVolumeDown: checkPermission<SystemPermission>(
      ["system:volumn"],
      permissions
    )(turnVolumeDown),
    systemToggleStageManager: checkPermission<SystemPermission>(
      ["system:ui"],
      permissions
    )(toggleStageManager),
    systemToggleBluetooth: checkPermission<SystemPermission>([], permissions)(toggleBluetooth),
    systemToggleHiddenFiles: checkPermission<SystemPermission>(
      ["system:ui"],
      permissions
    )(toggleHiddenFiles),
    systemEjectAllDisks: checkPermission<SystemPermission>(
      ["system:disk"],
      permissions
    )(ejectAllDisks),
    systemLogoutUser: checkPermission<SystemPermission>(["system:boot"], permissions)(logoutUser),
    systemToggleMute: checkPermission<SystemPermission>(["system:volumn"], permissions)(toggleMute),
    systemMute: checkPermission<SystemPermission>(["system:volumn"], permissions)(mute),
    systemUnmute: checkPermission<SystemPermission>(["system:volumn"], permissions)(unmute),
    systemGetFrontmostApp: checkPermission<SystemPermission>(
      ["system:apps"],
      permissions
    )(getFrontmostApp),
    systemHideAllAppsExceptFrontmost: checkPermission<SystemPermission>(
      ["system:apps"],
      permissions
    )(hideAllAppsExceptFrontmost),
    systemGetSelectedFilesInFileExplorer: checkPermission<SystemPermission>(
      ["system:fs"],
      permissions
    )(getSelectedFilesInFileExplorer)
  }
}

export function constructToastApi(): IToastServer {
  return {
    toastMessage: toast.message,
    toastInfo: toast.info,
    toastSuccess: toast.success,
    toastWarning: toast.warning,
    toastError: toast.error
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

export type IJarvisFullAPI = IFullAPI & ISystemServer & IToastServer

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
    constructSystemApi(permissions.filter((p) => p.startsWith("system:")) as SystemPermission[]),
    constructToastApi()
  ]
  return Object.assign({}, ...apis)
}
