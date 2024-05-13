use crate::commands::server::{start_server, Server};
// use crate::commands::apps::ApplicationsState;
use tauri::Manager;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

pub fn setup(app: &mut tauri::App) {
    app.manage(Server::default());
    // app.manage(ApplicationsState::default());
    let handle = app.handle();
    let server = handle.state::<Server>();
    server.start().expect("Failed to start local server");

    // app.set_activation_policy(tauri::ActivationPolicy::Accessory);

}
