/**
 * This file defines API interfaces for client. The client is the side that calls the API.
 * For example, the client can call the APIs from an iframe.
 */
import type { FetchOptions, FetchSendResponse } from "../api/fetch/types";
import type {
  emit,
  emitTo,
  EventCallback,
  EventName,
  EventTarget,
  listen,
  once
} from "@tauri-apps/api/event";
import type {
  ask,
  confirm,
  open as dialogOpen,
  message,
  OpenDialogOptions,
  save
} from "@tauri-apps/plugin-dialog";
import type {
  copyFile,
  create,
  exists,
  lstat,
  mkdir,
  readDir,
  readFile,
  readTextFile,
  remove,
  rename,
  stat,
  truncate,
  writeFile,
  writeTextFile
} from "@tauri-apps/plugin-fs";
import type {
  active,
  cancel,
  cancelAll,
  channels,
  createChannel,
  isPermissionGranted,
  onAction,
  onNotificationReceived,
  pending,
  registerActionTypes,
  removeActive,
  removeAllActive,
  removeChannel,
  requestPermission,
  sendNotification
} from "@tauri-apps/plugin-notification";
import {
  arch,
  exeExtension,
  family,
  locale,
  hostname as osHostname,
  platform,
  version
} from "@tauri-apps/plugin-os";
import type {
  hasFiles,
  hasHTML,
  hasImage,
  hasRTF,
  hasText,
  readFiles,
  readHtml,
  readImageBase64,
  readImageBinary,
  readRtf,
  readText,
  startMonitor,
  writeFiles,
  writeHtml,
  writeHtmlAndText,
  writeImageBase64,
  writeImageBinary,
  writeRtf,
  writeText
} from "tauri-plugin-clipboard-api";
import type {
  findAvailablePort,
  getInterfaces,
  getNonEmptyInterfaces,
  isHttpPortOpen,
  isPortTaken,
  localServerIsRunning,
  nonLocalhostNetworks,
  scanLocalNetworkOnlineHostsByPort,
  scanOnlineIpPortPairs,
  scanOnlineIpsByPort
} from "tauri-plugin-network-api";
import type {
  Child,
  ChildProcess,
  Command,
  CommandEvent,
  executeAppleScript,
  executeBashScript,
  executeNodeScript,
  executePowershellScript,
  executePythonScript,
  executeZshScript,
  hasCommand,
  InternalSpawnOptions,
  IOPayload,
  likelyOnWindows,
  makeAppleScript,
  makeBashScript,
  makeNodeScript,
  makePowershellScript,
  makePythonScript,
  makeZshScript,
  open as shellxOpen
} from "tauri-plugin-shellx-api";
import type {
  allSysInfo,
  batteries,
  components,
  cpuCount,
  cpuInfo,
  cpus,
  debugCommand,
  disks,
  kernelVersion,
  memoryInfo,
  networks,
  osVersion,
  processes,
  refreshAll,
  refreshCpu,
  refreshMemory,
  refreshProcesses,
  staticInfo,
  hostname as sysinfoHostname,
  name as sysinfoName,
  totalMemory,
  totalSwap,
  usedMemory,
  usedSwap
} from "tauri-plugin-system-info-api";

/* -------------------------------------------------------------------------- */
/*                                    Event                                   */
/* -------------------------------------------------------------------------- */
export interface IEventInternal {
  rawListen<T>(event: EventName, target: EventTarget, handler: EventCallback<T>): Promise<number>;
  rawUnlisten(event: string, eventId: number): Promise<void>;
  emit: typeof emit;
  emitTo: typeof emitTo;
  once: typeof once;
}

export interface IEvent {
  emit: typeof emit;
  emitTo: typeof emitTo;
  once: typeof once;
  listen: typeof listen;
}

/* -------------------------------------------------------------------------- */
/*                                   Dialog                                   */
/* -------------------------------------------------------------------------- */
export interface IDialog {
  ask: typeof ask;
  confirm: typeof confirm;
  message: typeof message;
  open(options?: OpenDialogOptions): ReturnType<typeof dialogOpen>;
  save: typeof save;
}

export interface IClipboard {
  readText: typeof readText;
  writeText: typeof writeText;
  readImageBase64: typeof readImageBase64;
  readImageBinary: typeof readImageBinary;
  writeImageBase64: typeof writeImageBase64;
  writeImageBinary: typeof writeImageBinary;
  readFiles: typeof readFiles;
  writeFiles: typeof writeFiles;
  readRtf: typeof readRtf;
  writeRtf: typeof writeRtf;
  readHtml: typeof readHtml;
  writeHtml: typeof writeHtml;
  writeHtmlAndText: typeof writeHtmlAndText;
  hasText: typeof hasText;
  hasRTF: typeof hasRTF;
  hasHTML: typeof hasHTML;
  hasImage: typeof hasImage;
  hasFiles: typeof hasFiles;
  startMonitor: typeof startMonitor;
}

export interface INotification {
  isPermissionGranted: typeof isPermissionGranted;
  requestPermission: typeof requestPermission;
  sendNotification: typeof sendNotification;
  registerActionTypes: typeof registerActionTypes;
  pending: typeof pending;
  cancel: typeof cancel;
  cancelAll: typeof cancelAll;
  active: typeof active;
  removeActive: typeof removeActive;
  removeAllActive: typeof removeAllActive;
  createChannel: typeof createChannel;
  removeChannel: typeof removeChannel;
  channels: typeof channels;
  onNotificationReceived: typeof onNotificationReceived;
  onAction: typeof onAction;
}

export interface IFs {
  readDir: typeof readDir;
  readFile: typeof readFile;
  readTextFile: typeof readTextFile;
  stat: typeof stat;
  lstat: typeof lstat;
  exists: typeof exists;
  mkdir: typeof mkdir;
  create: typeof create;
  copyFile: typeof copyFile;
  remove: typeof remove;
  rename: typeof rename;
  truncate: typeof truncate;
  writeFile: typeof writeFile;
  writeTextFile: typeof writeTextFile;
}

export interface IOs {
  platform: typeof platform;
  arch: typeof arch;
  exeExtension: typeof exeExtension;
  family: typeof family;
  hostname: typeof osHostname;
  eol: () => Promise<string>;
  version: typeof version;
  locale: typeof locale;
}

export interface IShellInternal {
  execute(
    program: string,
    args: string[],
    options: InternalSpawnOptions
  ): Promise<ChildProcess<IOPayload>>;
  kill(pid: number): Promise<void>;
  stdinWrite(buffer: string | number[], pid: number): Promise<void>;
  rawSpawn<O extends IOPayload>(
    program: string,
    args: string[],
    options: InternalSpawnOptions,
    cb: (evt: CommandEvent<O>) => void
  ): Promise<number>;
  open: typeof shellxOpen;
  makeBashScript: typeof makeBashScript;
  makePowershellScript: typeof makePowershellScript;
  makeAppleScript: typeof makeAppleScript;
  makePythonScript: typeof makePythonScript;
  makeZshScript: typeof makeZshScript;
  makeNodeScript: typeof makeNodeScript;
  executeBashScript: typeof executeBashScript;
  executePowershellScript: typeof executePowershellScript;
  executeAppleScript: typeof executeAppleScript;
  executePythonScript: typeof executePythonScript;
  executeZshScript: typeof executeZshScript;
  executeNodeScript: typeof executeNodeScript;
  hasCommand: typeof hasCommand;
  likelyOnWindows: typeof likelyOnWindows;
}

export interface IShell {
  open: typeof shellxOpen;
  makeBashScript: typeof makeBashScript;
  makePowershellScript: typeof makePowershellScript;
  makeAppleScript: typeof makeAppleScript;
  makePythonScript: typeof makePythonScript;
  makeZshScript: typeof makeZshScript;
  makeNodeScript: typeof makeNodeScript;
  executeBashScript: typeof executeBashScript;
  executePowershellScript: typeof executePowershellScript;
  executeAppleScript: typeof executeAppleScript;
  executePythonScript: typeof executePythonScript;
  executeZshScript: typeof executeZshScript;
  executeNodeScript: typeof executeNodeScript;
  hasCommand: typeof hasCommand;
  likelyOnWindows: typeof likelyOnWindows;
  Command: typeof Command;
  Child: typeof Child;
}

export interface IFetch {
  rawFetch(options: FetchOptions): Promise<number>;
  fetchCancel(rid: number): Promise<void>;
  fetchSend(rid: number): Promise<FetchSendResponse>;
  fetchReadBody(rid: number): Promise<ArrayBuffer | number[]>;
}

export interface ISystemInfo {
  allSysInfo: typeof allSysInfo;
  totalMemory: typeof totalMemory;
  usedMemory: typeof usedMemory;
  totalSwap: typeof totalSwap;
  usedSwap: typeof usedSwap;
  memoryInfo: typeof memoryInfo;
  hostname: typeof sysinfoHostname;
  name: typeof sysinfoName;
  kernelVersion: typeof kernelVersion;
  osVersion: typeof osVersion;
  staticInfo: typeof staticInfo;
  components: typeof components;
  cpus: typeof cpus;
  cpuCount: typeof cpuCount;
  cpuInfo: typeof cpuInfo;
  disks: typeof disks;
  networks: typeof networks;
  processes: typeof processes;
  refreshAll: typeof refreshAll;
  refreshMemory: typeof refreshMemory;
  refreshCpu: typeof refreshCpu;
  refreshProcesses: typeof refreshProcesses;
  debugCommand: typeof debugCommand;
  batteries: typeof batteries;
}

export interface INetwork {
  getInterfaces: typeof getInterfaces;
  getNonEmptyInterfaces: typeof getNonEmptyInterfaces;
  findAvailablePort: typeof findAvailablePort;
  isPortTaken: typeof isPortTaken;
  isHttpPortOpen: typeof isHttpPortOpen;
  scanOnlineIpPortPairs: typeof scanOnlineIpPortPairs;
  scanOnlineIpsByPort: typeof scanOnlineIpsByPort;
  nonLocalhostNetworks: typeof nonLocalhostNetworks;
  localServerIsRunning: typeof localServerIsRunning;
  scanLocalNetworkOnlineHostsByPort: typeof scanLocalNetworkOnlineHostsByPort;
}
