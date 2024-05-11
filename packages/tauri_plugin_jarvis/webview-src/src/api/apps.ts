import { invoke } from "@tauri-apps/api";
import { AppInfo } from "src/model/apps";

export function getAllApps(): Promise<AppInfo[]> {
  return invoke("get_applications");
}
