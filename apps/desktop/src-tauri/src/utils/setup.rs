use crate::commands::server::Server;
use tauri::{AppHandle, Manager, Runtime};
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

pub fn setup_app_path(handle: &AppHandle) {
    let app_d = handle.path().app_data_dir().unwrap();
    if !app_d.exists() {
        std::fs::create_dir_all(app_d).unwrap();
    }
}

pub fn setup_server<R: Runtime>(handle: &AppHandle<R>) {
    let server = handle.state::<Server>();
    server.start(handle).expect("Failed to start local server");
}

pub fn setup_mac_transparent_bg(handle: &AppHandle) {
    let window = handle.get_webview_window("main").unwrap();
    #[cfg(target_os = "macos")]
    apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
}
