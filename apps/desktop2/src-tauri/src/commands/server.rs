use crate::{server, utils::path::get_default_extensions_dir};
use std::{
    path::PathBuf,
    sync::{Arc, Mutex},
};
use tauri::{AppHandle, Runtime};
pub struct Server {
    join_handle: Arc<Mutex<Option<tauri::async_runtime::JoinHandle<()>>>>,
    extension_folder: Arc<Mutex<Option<PathBuf>>>,
    dev_extension_folder: Arc<Mutex<Option<PathBuf>>>,
}

impl Server {
    pub fn new(ext_folder: Option<PathBuf>, dev_ext_folder: Option<PathBuf>) -> Self {
        Self {
            join_handle: Arc::new(Mutex::new(None)),
            extension_folder: Arc::new(Mutex::new(ext_folder)),
            dev_extension_folder: Arc::new(Mutex::new(dev_ext_folder)),
        }
    }

    pub fn start<R: Runtime>(&self, app: &AppHandle<R>) -> Result<(), String> {
        let mut join_handle = self.join_handle.lock().unwrap();
        if join_handle.is_some() {
            return Err("Server is already running".to_string());
        }
        let mut ext_folder = self.extension_folder.lock().unwrap();
        let extension_folder = match ext_folder.to_owned() {
            Some(extension_folder) => extension_folder,
            None => {
                let path = get_default_extensions_dir(app).map_err(|err| err.to_string())?;
                // self.extension_folder.lock().unwrap().replace(path.clone());
                *ext_folder = Some(path.clone());
                path
            }
        };

        let dev_extension_folder = self.dev_extension_folder.lock().unwrap().to_owned();
        *join_handle = Some(tauri::async_runtime::spawn(async move {
            server::start_server(extension_folder, dev_extension_folder).await;
        }));
        Ok(())
    }

    pub fn stop(&self) {
        let mut join_handle = self.join_handle.lock().unwrap();
        if let Some(handle) = join_handle.take() {
            handle.abort();
        }
        *join_handle = None;
    }

    pub fn is_running(&self) -> bool {
        let join_handle = self.join_handle.lock().unwrap();
        join_handle.is_some()
    }
}

#[tauri::command]
pub async fn start_server<R: Runtime>(
    app: tauri::AppHandle<R>,
    server: tauri::State<'_, Server>,
) -> Result<(), String> {
    server.start(&app)?;
    Ok(())
}

#[tauri::command]
pub async fn stop_server(server: tauri::State<'_, Server>) -> Result<(), String> {
    server.stop();
    Ok(())
}

#[tauri::command]
pub async fn restart_server<R: Runtime>(
    app: tauri::AppHandle<R>,
    server: tauri::State<'_, Server>,
) -> Result<(), String> {
    server.stop();
    server.start(&app)?;
    Ok(())
}

#[tauri::command]
pub fn server_is_running(server: tauri::State<'_, Server>) -> Result<bool, String> {
    Ok(server.is_running())
}

#[tauri::command]
pub async fn set_dev_extension_folder(
    server: tauri::State<'_, Server>,
    dev_ext_folder: Option<PathBuf>,
) -> Result<(), String> {
    let mut dev_extension_folder = server.dev_extension_folder.lock().unwrap();
    *dev_extension_folder = dev_ext_folder;
    Ok(())
}

#[tauri::command]
pub async fn set_extension_folder(
    server: tauri::State<'_, Server>,
    ext_folder: Option<PathBuf>,
) -> Result<(), String> {
    let mut extension_folder = server.extension_folder.lock().unwrap();
    *extension_folder = ext_folder;
    Ok(())
}

#[tauri::command]
pub async fn get_extension_folder(
    server: tauri::State<'_, Server>,
) -> Result<Option<PathBuf>, String> {
    Ok(server.extension_folder.lock().unwrap().to_owned())
}

#[tauri::command]
pub async fn get_dev_extension_folder(
    server: tauri::State<'_, Server>,
) -> Result<Option<PathBuf>, String> {
    Ok(server.dev_extension_folder.lock().unwrap().to_owned())
}
