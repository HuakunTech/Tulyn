use tauri::Runtime;

use crate::utils::server;
use std::sync::{Arc, Mutex};
#[derive(Default)]
pub struct Server {
    // s: std::sync::Mutex<String>,
    // t: std::sync::Mutex<std::collections::HashMap<String, String>>,
    join_handle: Arc<Mutex<Option<tauri::async_runtime::JoinHandle<()>>>>,
}

impl Server {
    pub fn start(&self) -> Result<(), String> {
        let mut join_handle = self.join_handle.lock().unwrap();
        if join_handle.is_some() {
            return Err("Server is already running".to_string());
        }
        *join_handle = Some(tauri::async_runtime::spawn(async move {
            server::start_server().await;
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
        let mut join_handle = self.join_handle.lock().unwrap();
        join_handle.is_some()
    }
}

#[tauri::command]
pub fn start_server(server: tauri::State<'_, Server>) -> Result<(), String> {
    server.start()?;
    Ok(())
}

#[tauri::command]
pub fn stop_server(server: tauri::State<'_, Server>) -> Result<(), String> {
    server.stop();
    Ok(())
}

#[tauri::command]
pub fn server_is_running(server: tauri::State<'_, Server>) -> Result<bool, String> {
    Ok(server.is_running())
}
