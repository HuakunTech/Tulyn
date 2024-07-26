import { invoke } from "@tauri-apps/api/core"
import { ExtensionLabelMap } from "../models/extension"
import { generateJarvisPluginCommand } from "./common"

export function isWindowLabelRegistered(label: string): Promise<boolean> {
	return invoke(generateJarvisPluginCommand("is_window_label_registered"), { label })
}

/**
 * @param extensionPath
 * @returns Window Label
 */
export function registerExtensionWindow(extensionPath: string): Promise<string> {
	return invoke(generateJarvisPluginCommand("register_extension_window"), { extensionPath })
}

export function unregisterExtensionWindow(label: string): Promise<void> {
	return invoke(generateJarvisPluginCommand("unregister_extension_window"), { label })
}

export function getExtLabelMap(): Promise<ExtensionLabelMap> {
	return invoke(generateJarvisPluginCommand("get_ext_label_map"))
}
