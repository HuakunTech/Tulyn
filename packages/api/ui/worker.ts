import type { TListItem } from "tauri-plugin-jarvis-api/models"

export {
  clipboard,
  dialog,
  event,
  network,
  fs,
  notification,
  os,
  shell,
  sysInfo,
  path,
  log,
  updownload,
  fetch
} from "tauri-api-adapter/worker"
export { comlinkSystem as system } from "./api/system"

export interface IWorkerExtensionBase {
  name: string
  load(): Promise<void>
  default(): Promise<string>
  onSearchTermChange(term: string): Promise<void>
}
