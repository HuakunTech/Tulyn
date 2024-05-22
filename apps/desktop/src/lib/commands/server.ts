import { invoke } from "@tauri-apps/api/core";

export function startServer(): Promise<void> {
  return invoke("start_server");
}

export function stopServer(): Promise<void> {
  return invoke("stop_server");
}

export function restartServer(): Promise<void> {
  return invoke("restart_server");
}

export function serverIsRunning(): Promise<boolean> {
  return invoke("server_is_running");
}

export function setDevExtensionFolder(devExtFolder: string | undefined): Promise<void> {
  return invoke("set_dev_extension_folder", { devExtFolder });
}

export function setExtensionFolder(extFolder: string | undefined): Promise<void> {
  return invoke("set_extension_folder", { extFolder });
}

export function getExtensionFolder(): Promise<string | null> {
  return invoke("get_extension_folder");
}

export function getDevExtensionFolder(): Promise<string | null> {
  return invoke("get_dev_extension_folder");
}
