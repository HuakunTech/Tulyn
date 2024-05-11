import { invoke } from "@tauri-apps/api";

export function openDevTools() {
  return invoke("plugin:jarvis|open_devtools");
}
