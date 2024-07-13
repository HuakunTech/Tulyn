import { type AppInfo } from "tauri-plugin-jarvis-api/models"
import type { IToastServer } from "./server"
import type { IUITemplate } from "./worker"

type PromiseWrap<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>

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

export interface IToast {
  message: PromiseWrap<IToastServer["toastMessage"]>
  info: PromiseWrap<IToastServer["toastInfo"]>
  success: PromiseWrap<IToastServer["toastSuccess"]>
  warning: PromiseWrap<IToastServer["toastWarning"]>
  error: PromiseWrap<IToastServer["toastError"]>
}

export interface IUi {
  render: (view: IUITemplate) => void
}

// const getWorkerApi = () => getWorkerApiClient<IJarvisFullAPI>()
// const getIframeApi = () => getWindowApiClient<IJarvisFullAPI>(window.parent)
// export const defaultClientAPI: Remote<IJarvisFullAPI> = isInIframe()
//   ? getIframeApi()
//   : getWorkerApi()
