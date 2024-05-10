// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod utils;

use std::{fs, path::PathBuf};

use serde::{Deserialize, Serialize};
use utils::setup;

#[derive(Debug, Serialize, Deserialize)]
struct ExtInfo {
    name: String,
    path: String,
}

#[tauri::command]
fn get_extensions_info() -> Result<Vec<ExtInfo>, String> {
    let extensions_folder = PathBuf::from("/Users/hacker/Dev/projects/Jarvis/dev/extensions");
    let mut extensions_info = vec![];
    // list all files in the extensions folder
    let entries = fs::read_dir(extensions_folder).unwrap();
    for entry in entries {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.is_file() {
            continue;
        }

        let name = path.file_name().unwrap().to_str().unwrap().to_string();
        extensions_info.push(ExtInfo {
            name,
            path: path.to_str().unwrap().to_string(),
        });
    }
    Ok(extensions_info)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard::init())
        .invoke_handler(tauri::generate_handler![get_extensions_info])
        .setup(|app| {
            setup::setup(app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
