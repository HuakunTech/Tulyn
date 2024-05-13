// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod commands;
mod utils;
use utils::setup;
// use tauri::Manager;
// use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_jarvis::init())
        .plugin(tauri_plugin_clipboard::init())
        .invoke_handler(tauri::generate_handler![
            commands::load::get_extensions_info,
            commands::server::start_server,
            commands::server::stop_server,
            commands::server::server_is_running,
        ])
        .setup(|app| {
            // #[cfg(target_os = "macos")]
            // app.set_activation_policy(tauri::ActivationPolicy::Accessory);
            // let window = app.get_window("main").unwrap();
            // apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, Some(10.0))
            //     .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            // window.hide().unwrap();
            setup::setup(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
