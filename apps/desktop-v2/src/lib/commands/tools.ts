import { invoke } from "@tauri-apps/api/core";

export function openDevTools() {
  return invoke("open_devtools");
}

export function closeDevTools() {
  return invoke("close_devtools");
}

export function toggleDevTools() {
  console.log("toggleDevTools");

  return invoke("toggle_devtools");
}

export function isDevToolsOpen() {
  return invoke("is_devtools_open");
}
