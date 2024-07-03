import type {
  IClipboard,
  IDialog,
  IEventInternal,
  IFetch,
  IFs,
  INetwork,
  INotification,
  IOs,
  IShellInternal,
  ISystemInfo
} from "../api/client-types";
import type {
  EventCallback,
  EventName,
  Options as EventOptions,
  EventTarget,
  UnlistenFn
} from "@tauri-apps/api/event";

export interface IEventServer {
  eventRawListen<T>(
    event: EventName,
    target: EventTarget,
    handler: EventCallback<any>
  ): Promise<number>;
  eventRawUnlisten: IEventInternal["rawUnlisten"];
  eventEmit: IEventInternal["emit"];
  eventEmitTo: IEventInternal["emitTo"];
  eventOnce<T>(
    event: EventName,
    handler: EventCallback<any>,
    options?: EventOptions
  ): Promise<UnlistenFn>;
}

export interface IClipboardServer {
  clipboardReadText: IClipboard["readText"];
  clipboardWriteText: IClipboard["writeText"];
  clipboardReadImageBase64: IClipboard["readImageBase64"];
  clipboardReadImageBinary: IClipboard["readImageBinary"];
  clipboardWriteImageBase64: IClipboard["writeImageBase64"];
  clipboardWriteImageBinary: IClipboard["writeImageBinary"];
  clipboardReadFiles: IClipboard["readFiles"];
  clipboardWriteFiles: IClipboard["writeFiles"];
  clipboardReadRtf: IClipboard["readRtf"];
  clipboardWriteRtf: IClipboard["writeRtf"];
  clipboardReadHtml: IClipboard["readHtml"];
  clipboardWriteHtml: IClipboard["writeHtml"];
  clipboardWriteHtmlAndText: IClipboard["writeHtmlAndText"];
  clipboardHasText: IClipboard["hasText"];
  clipboardHasRTF: IClipboard["hasRTF"];
  clipboardHasHTML: IClipboard["hasHTML"];
  clipboardHasImage: IClipboard["hasImage"];
  clipboardHasFiles: IClipboard["hasFiles"];
  clipboardStartMonitor: IClipboard["startMonitor"];
}

export interface INotificationServer {
  notificationSendNotification: INotification["sendNotification"];
  notificationRequestPermission: INotification["requestPermission"];
  notificationIsPermissionGranted: INotification["isPermissionGranted"];
  notificationRegisterActionTypes: INotification["registerActionTypes"];
  notificationPending: INotification["pending"];
  notificationCancel: INotification["cancel"];
  notificationCancelAll: INotification["cancelAll"];
  notificationActive: INotification["active"];
  notificationRemoveActive: INotification["removeActive"];
  notificationRemoveAllActive: INotification["removeAllActive"];
  notificationCreateChannel: INotification["createChannel"];
  notificationRemoveChannel: INotification["removeChannel"];
  notificationChannels: INotification["channels"];
  notificationOnNotificationReceived: INotification["onNotificationReceived"];
  notificationOnAction: INotification["onAction"];
}

export interface IDialogServer {
  dialogAsk: IDialog["ask"];
  dialogConfirm: IDialog["confirm"];
  dialogMessage: IDialog["message"];
  dialogOpen: IDialog["open"];
  dialogSave: IDialog["save"];
}

export interface IFsServer {
  fsReadDir: IFs["readDir"];
  fsReadFile: IFs["readFile"];
  fsReadTextFile: IFs["readTextFile"];
  fsStat: IFs["stat"];
  fsLstat: IFs["lstat"];
  fsExists: IFs["exists"];
  fsMkdir: IFs["mkdir"];
  fsCreate: IFs["create"];
  fsCopyFile: IFs["copyFile"];
  fsRemove: IFs["remove"];
  fsRename: IFs["rename"];
  fsTruncate: IFs["truncate"];
  fsWriteFile: IFs["writeFile"];
  fsWriteTextFile: IFs["writeTextFile"];
}

export interface IOsServer {
  osPlatform: IOs["platform"];
  osArch: IOs["arch"];
  osExeExtension: IOs["exeExtension"];
  osFamily: IOs["family"];
  osHostname: IOs["hostname"];
  osEol: IOs["eol"];
  osVersion: IOs["version"];
  osLocale: IOs["locale"];
}

export interface IShellServer {
  shellExecute: IShellInternal["execute"];
  shellKill: IShellInternal["kill"];
  shellStdinWrite: IShellInternal["stdinWrite"];
  shellOpen: IShellInternal["open"];
  shellRawSpawn: IShellInternal["rawSpawn"];
  shellExecuteBashScript: IShellInternal["executeBashScript"];
  shellExecutePowershellScript: IShellInternal["executePowershellScript"];
  shellExecuteAppleScript: IShellInternal["executeAppleScript"];
  shellExecutePythonScript: IShellInternal["executePythonScript"];
  shellExecuteZshScript: IShellInternal["executeZshScript"];
  shellExecuteNodeScript: IShellInternal["executeNodeScript"];
  shellHasCommand: IShellInternal["hasCommand"];
  shellLikelyOnWindows: IShellInternal["likelyOnWindows"];
}

export interface IFetchServer {
  fetchRawFetch: IFetch["rawFetch"];
  fetchFetchCancel: IFetch["fetchCancel"];
  fetchFetchSend: IFetch["fetchSend"];
  fetchFetchReadBody: IFetch["fetchReadBody"];
}

export interface ISystemInfoServer {
  sysInfoAllSysInfo: ISystemInfo["allSysInfo"];
  sysInfoTotalMemory: ISystemInfo["totalMemory"];
  sysInfoUsedMemory: ISystemInfo["usedMemory"];
  sysInfoTotalSwap: ISystemInfo["totalSwap"];
  sysInfoUsedSwap: ISystemInfo["usedSwap"];
  sysInfoMemoryInfo: ISystemInfo["memoryInfo"];
  sysInfoHostname: ISystemInfo["hostname"];
  sysInfoName: ISystemInfo["name"];
  sysInfoKernelVersion: ISystemInfo["kernelVersion"];
  sysInfoOsVersion: ISystemInfo["osVersion"];
  sysInfoStaticInfo: ISystemInfo["staticInfo"];
  sysInfoComponents: ISystemInfo["components"];
  sysInfoCpus: ISystemInfo["cpus"];
  sysInfoCpuCount: ISystemInfo["cpuCount"];
  sysInfoCpuInfo: ISystemInfo["cpuInfo"];
  sysInfoDisks: ISystemInfo["disks"];
  sysInfoNetworks: ISystemInfo["networks"];
  sysInfoProcesses: ISystemInfo["processes"];
  sysInfoRefreshAll: ISystemInfo["refreshAll"];
  sysInfoRefreshMemory: ISystemInfo["refreshMemory"];
  sysInfoRefreshCpu: ISystemInfo["refreshCpu"];
  sysInfoRefreshProcesses: ISystemInfo["refreshProcesses"];
  sysInfoDebugCommand: ISystemInfo["debugCommand"];
  sysInfoBatteries: ISystemInfo["batteries"];
}

export interface INetworkServer {
  networkGetInterfaces: INetwork["getInterfaces"];
  networkGetNonEmptyInterfaces: INetwork["getNonEmptyInterfaces"];
  networkFindAvailablePort: INetwork["findAvailablePort"];
  networkIsPortTaken: INetwork["isPortTaken"];
  networkIsHttpPortOpen: INetwork["isHttpPortOpen"];
  networkScanOnlineIpPortPairs: INetwork["scanOnlineIpPortPairs"];
  networkScanOnlineIpsByPort: INetwork["scanOnlineIpsByPort"];
  networkNonLocalhostNetworks: INetwork["nonLocalhostNetworks"];
  networkLocalServerIsRunning: INetwork["localServerIsRunning"];
  networkScanLocalNetworkOnlineHostsByPort: INetwork["scanLocalNetworkOnlineHostsByPort"];
}

/**
 * IFullAPI defines all APIs implemented in this package combined together
 * @example
 * ```ts
 * const clientAPI = getApiClient<IFullAPI>(window.parent)
 * ```
 */
export type IFullAPI = IClipboardServer &
  INotificationServer &
  IDialogServer &
  IFsServer &
  IShellServer &
  IOsServer &
  IFetchServer &
  ISystemInfoServer &
  INetworkServer &
  IEventServer;
