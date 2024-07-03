import { invoke } from "@tauri-apps/api/core"

export function runAppleScript(): Promise<string> {
  return invoke("plugin:jarvis|run_apple_script")
}

export function runPowershell(): Promise<string> {
  return invoke("plugin:jarvis|run_powershell")
}
