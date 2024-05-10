// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod commands;
mod utils;
use utils::setup;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_jarvis::init())
        .plugin(tauri_plugin_clipboard::init())
        .invoke_handler(tauri::generate_handler![
            commands::load::get_extensions_info,
            commands::dev::open_dev_tool
        ])
        .setup(|app| {
            setup::setup(app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
