// export { default as clipboard } from "tauri-plugin-clipboard-api" // re-export from tauri-plugin-clipboard-api
// export * as fs from "./fs"
// export * as window from "./window"
// export * as http from "@tauri-apps/plugin-http"
// export * as dialog from "./dialog"
// export * as log from "@tauri-apps/plugin-log"
// export * as notification from "./notification"
// Shell
// export * as shell from "./shell"
// export { open } from "./shell"
// Network
// export {
//   JarvisStore,
//   getFrontmostApp,
//   getSelectedFilesInFileExplorer,
//   pathExists,
//   openDevTools,
//   closeDevTools,
//   isDevToolsOpen,
//   toggleDevTools,
//   appIsDev
// } from "tauri-plugin-jarvis-api/commands"

export { constructJarvisServerAPIWithPermissions, type AllJarvisPermission } from "./server"
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
  fetch,
  exposeApiToWindow,
  exposeApiToWorker
} from "tauri-api-adapter"
