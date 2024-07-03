import { invoke } from "@tauri-apps/api/core"

/**
 * @returns <app data dir>/extensions
 */
export function getDefaultExtensionsDir(): Promise<String> {
  return invoke("plugin:jarvis|get_default_extensions_dir")
}

/**
 * @returns <app data dir>/extensions_storage
 */
export function getDefaultExtensionsStorageDir(): Promise<String> {
  return invoke("plugin:jarvis|get_default_extensions_storage_dir")
}
