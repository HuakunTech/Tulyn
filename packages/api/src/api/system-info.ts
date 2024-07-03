import { type ISystemInfo } from "../api/client-types"
import { defaultClientAPI, isMain } from "../client"
import { type Remote } from "@huakunshen/comlink"
import {
  allSysInfo,
  batteries,
  components,
  cpuCount,
  cpuInfo,
  cpus,
  debugCommand,
  disks,
  hostname,
  kernelVersion,
  memoryInfo,
  name,
  networks,
  osVersion,
  processes,
  refreshAll,
  refreshCpu,
  refreshMemory,
  refreshProcesses,
  staticInfo,
  totalMemory,
  totalSwap,
  usedMemory,
  usedSwap
} from "tauri-plugin-system-info-api"
import { type ISystemInfoServer } from "./server-types"

export function constructAPI(api: Remote<ISystemInfoServer>): ISystemInfo {
  return {
    allSysInfo: api.sysInfoAllSysInfo,
    totalMemory: api.sysInfoTotalMemory,
    usedMemory: api.sysInfoUsedMemory,
    totalSwap: api.sysInfoTotalSwap,
    usedSwap: api.sysInfoUsedSwap,
    memoryInfo: api.sysInfoMemoryInfo,
    hostname: api.sysInfoHostname,
    name: api.sysInfoName,
    kernelVersion: api.sysInfoKernelVersion,
    osVersion: api.sysInfoOsVersion,
    staticInfo: api.sysInfoStaticInfo,
    components: api.sysInfoComponents,
    cpus: api.sysInfoCpus,
    cpuCount: api.sysInfoCpuCount,
    cpuInfo: api.sysInfoCpuInfo,
    disks: api.sysInfoDisks,
    networks: api.sysInfoNetworks,
    processes: api.sysInfoProcesses,
    refreshAll: api.sysInfoRefreshAll,
    refreshMemory: api.sysInfoRefreshMemory,
    refreshCpu: api.sysInfoRefreshCpu,
    refreshProcesses: api.sysInfoRefreshProcesses,
    debugCommand: api.sysInfoDebugCommand,
    batteries: api.sysInfoBatteries
  }
}
export const comlinkSysInfo: ISystemInfo = constructAPI(defaultClientAPI)

export const nativeSysInfo: ISystemInfo = {
  allSysInfo,
  totalMemory,
  usedMemory,
  totalSwap,
  usedSwap,
  memoryInfo,
  hostname,
  name,
  kernelVersion,
  osVersion,
  staticInfo,
  components,
  cpus,
  cpuCount,
  cpuInfo,
  disks,
  networks,
  processes,
  refreshAll,
  refreshMemory,
  refreshCpu,
  refreshProcesses,
  debugCommand,
  batteries
}

export const sysInfo = isMain ? nativeSysInfo : comlinkSysInfo
