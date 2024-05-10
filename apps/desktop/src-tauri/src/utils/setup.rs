use crate::utils::server;

pub fn setup(app: &mut tauri::App) {
    tauri::async_runtime::spawn(async move {
        server::start_server().await;
    });
    // server::start_server().expect("Failed to start local server");
    // start_server().expect("Failed to start local server");
}
