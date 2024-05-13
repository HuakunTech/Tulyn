import { invoke } from "@tauri-apps/api";
import { AppInfo } from "src/model/apps";
import { IconType, TListItem } from "src/model/list";

export function getAllApps(): Promise<AppInfo[]> {
  return invoke("plugin:jarvis|get_applications");
}

export function refreshApplicationsList(): Promise<void> {
  return invoke("plugin:jarvis|refresh_applications_list");
}

export function refreshApplicationsListInBg(): Promise<void> {
  return invoke("plugin:jarvis|refresh_applications_list_in_bg");
}

export function convertAppToTListItem(app: AppInfo): TListItem {
  return {
    title: app.name,
    value: app.app_desktop_path,
    description: "",
    type: "Application",
    icon: null,
    keywords: app.name.split(" "),
  };
}
