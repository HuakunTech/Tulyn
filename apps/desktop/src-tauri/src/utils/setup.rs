use crate::commands::server::{start_server, Server};
use tauri::Manager;

pub fn setup(app: &mut tauri::App) {
    app.manage(Server::default());
    let handle = app.handle();
    let server = handle.state::<Server>();
    server.start().expect("Failed to start local server");
}
