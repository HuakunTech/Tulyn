import { invoke } from "@tauri-apps/api/core";
import { ExtensionLabelMap } from "@/models/extension";

export function isWindowLabelRegistered(label: string): Promise<boolean> {
  return invoke("plugin:jarvis|is_window_label_registered", { label });
}

/**
 * @param extensionPath
 * @returns Window Label
 */
export function registerExtensionWindow(extensionPath: string): Promise<string> {
  return invoke("plugin:jarvis|register_extension_window", { extensionPath });
}

export function unregisterExtensionWindow(label: string): Promise<void> {
  return invoke("plugin:jarvis|unregister_extension_window", { label });
}

export function getExtLabelMap(): Promise<ExtensionLabelMap> {
  return invoke("plugin:jarvis|get_ext_label_map");
}
