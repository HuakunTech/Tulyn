import { invoke } from "@tauri-apps/api/core";

export function startServer(): Promise<void> {
  return invoke("plugin:jarvis|start_server");
}

export function stopServer(): Promise<void> {
  return invoke("plugin:jarvis|stop_server");
}

export function restartServer(): Promise<void> {
  return invoke("plugin:jarvis|restart_server");
}

export function serverIsRunning(): Promise<boolean> {
  return invoke("plugin:jarvis|server_is_running");
}

export function setDevExtensionFolder(devExtFolder: string | undefined): Promise<void> {
  return invoke("plugin:jarvis|set_dev_extension_folder", { devExtFolder });
}

export function setExtensionFolder(extFolder: string | undefined): Promise<void> {
  return invoke("plugin:jarvis|set_extension_folder", { extFolder });
}

export function getExtensionFolder(): Promise<string | null> {
  return invoke("plugin:jarvis|get_extension_folder");
}

export function getDevExtensionFolder(): Promise<string | null> {
  return invoke("plugin:jarvis|get_dev_extension_folder");
}
