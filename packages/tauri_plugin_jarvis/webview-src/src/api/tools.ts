import { invoke } from "@tauri-apps/api";

export function openDevTools() {
  return invoke("plugin:jarvis|open_devtools");
}

export function closeDevTools() {
  return invoke("plugin:jarvis|close_devtools");
}

export function toggleDevTools() {
  return invoke("plugin:jarvis|toggle_devtools");
}

export function isDevToolsOpen() {
  return invoke("plugin:jarvis|is_devtools_open");
}
