import { getWindowApiClient, getWorkerApiClient, isInIframe } from "tauri-api-adapter"
import { AppInfo } from "tauri-plugin-jarvis-api/models"
import type { IJarvisFullAPI } from "./server"

export interface ISystem {
  openTrash(): Promise<void>
  emptyTrash(): Promise<void>
  shutdown(): Promise<void>
  reboot(): Promise<void>
  sleep(): Promise<void>
  toggleSystemAppearance(): Promise<void>
  showDesktop(): Promise<void>
  quitAllApps(): Promise<void>
  sleepDisplays(): Promise<void>
  setVolume(percentage: number): Promise<void>
  setVolumeTo0(): Promise<void>
  setVolumeTo25(): Promise<void>
  setVolumeTo50(): Promise<void>
  setVolumeTo75(): Promise<void>
  setVolumeTo100(): Promise<void>
  turnVolumeUp(): Promise<void>
  turnVolumeDown(): Promise<void>
  toggleStageManager(): Promise<void>
  toggleBluetooth(): Promise<void>
  toggleHiddenFiles(): Promise<void>
  ejectAllDisks(): Promise<void>
  logoutUser(): Promise<void>
  toggleMute(): Promise<void>
  mute(): Promise<void>
  unmute(): Promise<void>
  getFrontmostApp(): Promise<AppInfo>
  hideAllAppsExceptFrontmost(): Promise<void>
  getSelectedFilesInFileExplorer(): Promise<string[]>
}

const getWorkerApi = () => getWorkerApiClient<IJarvisFullAPI>()
const getIframeApi = () => getWindowApiClient<IJarvisFullAPI>(window.parent)
export const defaultClientAPI = isInIframe() ? getIframeApi() : getWorkerApi()
