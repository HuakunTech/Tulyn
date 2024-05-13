import { invoke } from "@tauri-apps/api";
import { AppInfo } from "src/model/apps";

export function getAllApps(): Promise<AppInfo[]> {
  return invoke("plugin:jarvis|get_applications");
}

export function refreshApplicationsList(): Promise<void> {
  return invoke("plugin:jarvis|refresh_applications_list");
}

export function refreshApplicationsListInBg(): Promise<void> {
  return invoke("plugin:jarvis|refresh_applications_list_in_bg");
}
