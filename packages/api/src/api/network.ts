import { type INetwork } from "../api/client-types"
import { defaultClientAPI, isMain } from "../client"
import { type Remote } from "@huakunshen/comlink"
import {
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
} from "tauri-plugin-network-api"
import { type INetworkServer } from "./server-types"

export function constructAPI(api: Remote<INetworkServer>): INetwork {
  return {
    getInterfaces: api.networkGetInterfaces,
    getNonEmptyInterfaces: api.networkGetNonEmptyInterfaces,
    findAvailablePort: api.networkFindAvailablePort,
    isPortTaken: api.networkIsPortTaken,
    isHttpPortOpen: api.networkIsHttpPortOpen,
    scanOnlineIpPortPairs: api.networkScanOnlineIpPortPairs,
    scanOnlineIpsByPort: api.networkScanOnlineIpsByPort,
    nonLocalhostNetworks: api.networkNonLocalhostNetworks,
    localServerIsRunning: api.networkLocalServerIsRunning,
    scanLocalNetworkOnlineHostsByPort: api.networkScanLocalNetworkOnlineHostsByPort
  }
}
export const comlinkNetwork: INetwork = constructAPI(defaultClientAPI)

export const nativeNetwork: INetwork = {
  getInterfaces: getInterfaces,
  getNonEmptyInterfaces: getNonEmptyInterfaces,
  findAvailablePort: findAvailablePort,
  isPortTaken: isPortTaken,
  isHttpPortOpen: isHttpPortOpen,
  scanOnlineIpPortPairs: scanOnlineIpPortPairs,
  scanOnlineIpsByPort: scanOnlineIpsByPort,
  nonLocalhostNetworks: nonLocalhostNetworks,
  localServerIsRunning: localServerIsRunning,
  scanLocalNetworkOnlineHostsByPort: scanLocalNetworkOnlineHostsByPort
}

export const network = isMain ? nativeNetwork : comlinkNetwork
