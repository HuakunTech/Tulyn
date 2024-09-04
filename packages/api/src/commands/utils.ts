import { invoke } from "@tauri-apps/api/core"
import { generateJarvisPluginCommand } from "./common"

export function plistToJson(plistContent: string) {
	return invoke<string>(generateJarvisPluginCommand("plist_to_json"), { plistContent })
}
