// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;

mod setup;
use tauri_plugin_jarvis::{
    server::Protocol,
    utils::{path::get_default_extensions_dir, settings::AppSettings},
};
use tauri_plugin_store::StoreBuilder;
pub mod utils;
#[cfg(target_os = "macos")]
use tauri::ActivationPolicy;
use tauri::Manager;
pub use tauri_plugin_log::fern::colors::ColoredLevelConfig;

fn main() {
    let shell_unlocked = true;
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets(utils::log::get_log_targets())
                .level(utils::log::get_log_level())
                .filter(|metadata| !metadata.target().starts_with("mdns_sd"))
                .with_colors(ColoredLevelConfig::default())
                .max_file_size(10_000_000) // max 10MB
                .format(|out, message, record| {
                    out.finish(format_args!(
                        "{}[{}] {}",
                        chrono::Local::now().format("[%Y-%m-%d][%H:%M:%S]"),
                        // record.target(),
                        record.level(),
                        message
                    ))
                })
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shellx::init(shell_unlocked))
        .plugin(tauri_plugin_jarvis::init())
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_network::init())
        .plugin(tauri_plugin_system_info::init())
        .invoke_handler(tauri::generate_handler![])
        .register_uri_scheme_protocol("appicon", |_app, request| {
            let url = &request.uri().path()[1..];
            let url = urlencoding::decode(url).unwrap().to_string();
            let path = PathBuf::from(url);
            return tauri_plugin_jarvis::utils::icns::load_icon(path);
        })
        .setup(|app| {
            setup::window::setup_window(app.handle());
            setup::tray::create_tray(app.handle())?;
            // #[cfg(all(target_os = "macos", debug_assertions))]
            // app.set_activation_policy(ActivationPolicy::Accessory);
            let mut store = StoreBuilder::new("appConfig.bin").build(app.handle().clone());
            let _ = store.load();

            let app_settings = match AppSettings::load_from_store(&store) {
                Ok(settings) => settings,
                Err(_) => AppSettings::default(),
            };
            let ext_folder: Option<PathBuf> = get_default_extensions_dir(app.handle()).ok();
            let my_port = tauri_plugin_network::network::scan::find_available_port_from_list(
                tauri_plugin_jarvis::server::CANDIDATE_PORTS.to_vec(),
            )
            .unwrap();
            println!("Jarvis Server Port: {}", my_port);
            app.manage(tauri_plugin_jarvis::server::http::Server::new(
                app.handle().clone(),
                my_port,
                Protocol::Http,
                ext_folder,
                app_settings.dev_extention_path,
            ));
            tauri_plugin_jarvis::setup::server::setup_server(app.handle())?; // start the server

            let mdns = tauri_plugin_jarvis::setup::peer_discovery::setup_mdns(my_port)?;
            tauri_plugin_jarvis::setup::peer_discovery::handle_mdns_service_evt(
                app.handle(),
                mdns.browse()?,
            );
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
                // window.close_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
