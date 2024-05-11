import { invoke } from "@tauri-apps/api";

export function getAllApps() {
  return invoke("get_applications");
}
