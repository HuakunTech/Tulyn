use crate::server::http::Server;
use std::path::PathBuf;

#[tauri::command]
pub async fn start_server(server: tauri::State<'_, Server>) -> Result<(), String> {
    server.start().await.map_err(|err| err.to_string())
}

#[tauri::command]
pub async fn stop_server(server: tauri::State<'_, Server>) -> Result<(), String> {
    server.stop().await.map_err(|err| err.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn restart_server(server: tauri::State<'_, Server>) -> Result<(), String> {
    server.stop().await.map_err(|err| err.to_string())?;
    server.start().await.map_err(|err| err.to_string())
}

#[tauri::command]
pub async fn server_is_running(server: tauri::State<'_, Server>) -> Result<bool, String> {
    Ok(server.is_running().await)
}

#[tauri::command]
pub async fn set_dev_extension_folder(
    server: tauri::State<'_, Server>,
    dev_ext_folder: Option<PathBuf>,
) -> Result<(), String> {
    let mut dev_extension_folder = server.dev_extension_folder.lock().await;
    *dev_extension_folder = dev_ext_folder;
    Ok(())
}

#[tauri::command]
pub async fn set_extension_folder(
    server: tauri::State<'_, Server>,
    ext_folder: Option<PathBuf>,
) -> Result<(), String> {
    let mut extension_folder = server.extension_folder.lock().await;
    *extension_folder = ext_folder;
    Ok(())
}

#[tauri::command]
pub async fn get_extension_folder(
    server: tauri::State<'_, Server>,
) -> Result<Option<PathBuf>, String> {
    Ok(server.extension_folder.lock().await.to_owned())
}

#[tauri::command]
pub async fn get_dev_extension_folder(
    server: tauri::State<'_, Server>,
) -> Result<Option<PathBuf>, String> {
    Ok(server.dev_extension_folder.lock().await.to_owned())
}
