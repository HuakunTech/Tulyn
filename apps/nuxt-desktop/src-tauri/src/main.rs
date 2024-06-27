// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
    let shell_unlocked = true;
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        // .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shellx::init(shell_unlocked))
        .plugin(tauri_plugin_jarvis::init())
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_network::init())
        .plugin(tauri_plugin_system_info::init())
        .invoke_handler(tauri::generate_handler![])
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
