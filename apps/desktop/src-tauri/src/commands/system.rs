use super::utils::run_apple_script;

#[tauri::command]
pub async fn open_trash() -> Result<(), String> {
    // #[cfg(target_os = "macos")]
    run_apple_script("tell application \"Finder\" to open trash")
    // #[cfg(target_os = "linux")]
    // run_linux_command("xdg-open trash")
}

#[tauri::command]
pub async fn empty_trash() -> Result<(), String> {
    run_apple_script("tell application \"Finder\" to empty the trash")
}

#[tauri::command]
pub async fn shutdown() -> Result<(), String> {
    run_apple_script("tell application \"System Events\" to shut down")
}

#[tauri::command]
pub async fn reboot() -> Result<(), String> {
    run_apple_script("tell application \"System Events\" to restart")
}

#[tauri::command]
pub async fn sleep() -> Result<(), String> {
    run_apple_script("tell application \"System Events\" to sleep")
}

/// ```applescript
/// tell application "System Events" to tell appearance preferences
///   set dark_mode to dark mode
///   set dark_mode to not dark_mode
///   set dark mode to dark_mode
/// end tell
/// ```
#[tauri::command]
pub async fn toggle_system_appearance() -> Result<(), String> {
    run_apple_script(
        r#"
        tell application "System Events" to tell appearance preferences
            set dark_mode to dark mode
            set dark_mode to not dark_mode
            set dark mode to dark_mode
        end tell
    "#,
    )
}

#[tauri::command]
pub async fn show_desktop() -> Result<(), String> {
    run_apple_script("tell application \"System Events\" to key code 103")
}

#[tauri::command]
pub async fn quit_all_apps() -> Result<(), String> {
    todo!()
}

#[tauri::command]
pub async fn sleep_displays() -> Result<(), String> {
    run_apple_script("do shell script \"pmset displaysleepnow\"")
}

/// Set Volume to 0
#[tauri::command]
pub async fn set_volume(percentage: u8) -> Result<(), String> {
    run_apple_script(&format!("set volume output volume {}", percentage))
}
/// Turn Volume Up
#[tauri::command]
pub async fn turn_volume_up() -> Result<(), String> {
    run_apple_script("set volume output volume (output volume of (get volume settings) + 10)")
}
/// Turn Volume Down
#[tauri::command]
pub async fn turn_volume_down() -> Result<(), String> {
    run_apple_script("set volume output volume (output volume of (get volume settings) - 10)")
}
/// Toggle Stage Manager
#[tauri::command]
pub async fn toggle_stage_manager() -> Result<(), String> {
    todo!()
}

/// Toggle Bluetooth
#[tauri::command]
pub async fn toggle_bluetooth() -> Result<(), String> {
    todo!()
}

/// Toggle Hidden Files
#[tauri::command]
pub async fn toggle_hidden_files() -> Result<(), String> {
    todo!()
}

/// Eject All Disks
#[tauri::command]
pub async fn eject_all_disks() -> Result<(), String> {
    run_apple_script("tell application \"Finder\" to eject (every disk whose ejectable is true)")
}
/// Logout <User>
#[tauri::command]
pub async fn logout_user() -> Result<(), String> {
    run_apple_script("tell application \"System Events\" to log out")
}
/// Toggle Mute
#[tauri::command]
pub async fn toggle_mute() -> Result<(), String> {
    run_apple_script("set volume output muted not (output muted of (get volume settings))")
}

#[tauri::command]
pub async fn mute() -> Result<(), String> {
    run_apple_script("set volume with output muted")
}

#[tauri::command]
pub async fn unmute() -> Result<(), String> {
    run_apple_script("set volume without output muted")
}
/// Hide All Apps Except Frontmost
#[tauri::command]
pub async fn hide_all_apps_except_frontmost() -> Result<(), String> {
    run_apple_script(
        r#"tell application "System Events"
            set frontApp to name of first application process whose frontmost is true
            set visibleApps to every process whose visible is true and name is not frontApp
            repeat with theApp in visibleApps
                set visible of theApp to false
            end repeat
        end tell"#,
    )
}
