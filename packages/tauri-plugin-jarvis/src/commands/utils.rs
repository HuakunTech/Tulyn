use crate::utils;

#[tauri::command]
pub fn run_apple_script(script: &str) -> Result<String, String> {
    utils::script::run_apple_script(script).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn run_powershell(script: &str) -> Result<String, String> {
    utils::script::run_powershell(script).map_err(|e| e.to_string())
}
