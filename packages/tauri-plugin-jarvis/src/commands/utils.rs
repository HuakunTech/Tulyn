use crate::utils::{self, script::ScriptOutput};

#[tauri::command]
pub fn run_apple_script(script: &str) -> Result<ScriptOutput, String> {
    utils::script::run_apple_script(script).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn run_powershell(script: &str) -> Result<ScriptOutput, String> {
    utils::script::run_powershell(script).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn run_script(command: &str, args: Vec<&str>) -> Result<ScriptOutput, String> {
    utils::script::run_script(command, args).map_err(|e| e.to_string())
}
