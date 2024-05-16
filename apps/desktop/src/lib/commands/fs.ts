import { invoke } from "@tauri-apps/api/core";

export function pathExists(path: string): Promise<boolean> {
  return invoke("path_exists", { path });
}
