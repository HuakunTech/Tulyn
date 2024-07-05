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

export abstract class IWorkerExtensionBase {
  name: string
  constructor(name: string) {
    this.name = name
  }

  abstract load(): Promise<void>

  abstract default(): Promise<string>
}
