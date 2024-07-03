use axum::extract::State;

use super::model::{ServerInfo, ServerState};

/// This file contains REST API endpoints

pub async fn web_root() -> &'static str {
    "Hello World!"
}

pub async fn get_server_info(State(state): State<ServerState>) -> axum::Json<ServerInfo> {
    let pkg_info = state.app_handle.package_info();
    axum::Json(ServerInfo {
        service_name: pkg_info.name.to_string(),
        service_version: pkg_info.version.to_string(),
    })
}
