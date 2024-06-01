import { invoke } from "@tauri-apps/api/core";

export function openDevTools(): Promise<void> {
  return invoke("plugin:jarvis|open_devtools");
}

export function closeDevTools(): Promise<void> {
  return invoke("plugin:jarvis|close_devtools");
}

export function toggleDevTools(): Promise<void> {
  return invoke("plugin:jarvis|toggle_devtools");
}

export function isDevToolsOpen(): Promise<boolean> {
  return invoke("plugin:jarvis|is_devtools_open");
}

/**
 * Check if the app is running in development mode.
 * @returns true if the app is running in development mode, false otherwise
 */
export function appIsDev(): Promise<boolean> {
  return invoke("plugin:jarvis|app_is_dev");
}
