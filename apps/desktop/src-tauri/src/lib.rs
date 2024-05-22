use crate::utils::icns::load_icns;
use applications::utils::image::RustImage;
use commands::{apps::ApplicationsState, server::Server};
use std::path::PathBuf;
use tauri::Manager;
use tauri_plugin_log::{Target, TargetKind};
use tauri_plugin_store::StoreBuilder;
use tokio::runtime::Runtime;
use utils::{path::get_default_extensions_dir, settings::AppSettings};
pub mod commands;
pub mod model;
pub mod server;
pub mod utils;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};
// use rdev::{listen, Event};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // get cwd
    let mut log_path = std::env::current_dir().unwrap();
    log_path.push("jarvis-logs");

    tauri::Builder::default()
        .register_uri_scheme_protocol("macicns", |_app, request| {
            let url = &request.uri().path()[1..];
            let url = url.replace("%2F", "/").replace("%20", " ");
            let path = PathBuf::from(url);
            if !path.exists() {
                return tauri::http::Response::builder()
                    .status(tauri::http::StatusCode::NOT_FOUND)
                    .body("file not found".as_bytes().to_vec())
                    .unwrap();
            }
            let icns = load_icns(&path);
            match icns {
                Ok(icns) => {
                    let png = icns.to_png().unwrap();
                    tauri::http::Response::builder()
                        .body(png.get_bytes().to_vec())
                        .unwrap()
                }
                Err(error) => tauri::http::Response::builder()
                    .status(tauri::http::StatusCode::INTERNAL_SERVER_ERROR)
                    .body(error.to_string().as_bytes().to_vec())
                    .unwrap(),
            }
        })
        .register_uri_scheme_protocol("extasset", |_app, request| {
            let url = &request.uri().path()[1..];
            // let url = url.replace("%2F", "/").replace("%20", " ");
            let url = urlencoding::decode(url).unwrap().to_string();
            let path = PathBuf::from(url);
            println!("path: {:?}", path);
            if !path.exists() {
                return tauri::http::Response::builder()
                    .status(tauri::http::StatusCode::NOT_FOUND)
                    .body("file not found".as_bytes().to_vec())
                    .unwrap();
            }
            let bytes = std::fs::read(&path).unwrap();
            tauri::http::Response::builder().body(bytes).unwrap()
        })
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        // .plugin(tauri_plugin_log::Builder::new().build())
        // .plugin(
        //     tauri_plugin_log::Builder::new()
        //         .targets([
        //             Target::new(TargetKind::Stdout),
        //             Target::new(TargetKind::LogDir {
        //                 file_name: Some(log_path.to_str().unwrap().to_string()),
        //             }),
        //             Target::new(TargetKind::Webview),
        //         ])
        //         .build(),
        // )
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_clipboard::init())
        .invoke_handler(tauri::generate_handler![
            // dev commands
            commands::dev::open_devtools,
            commands::dev::close_devtools,
            commands::dev::is_devtools_open,
            commands::dev::toggle_devtools,
            // system commands
            commands::system::open_trash,
            commands::system::empty_trash,
            commands::system::shutdown,
            commands::system::reboot,
            commands::system::sleep,
            commands::system::toggle_system_appearance,
            commands::system::show_desktop,
            commands::system::quit_all_apps,
            commands::system::sleep_displays,
            commands::system::set_volume,
            commands::system::turn_volume_up,
            commands::system::turn_volume_down,
            commands::system::toggle_stage_manager,
            commands::system::toggle_bluetooth,
            commands::system::toggle_hidden_files,
            commands::system::eject_all_disks,
            commands::system::logout_user,
            commands::system::toggle_mute,
            commands::system::mute,
            commands::system::unmute,
            commands::system::hide_all_apps_except_frontmost,
            // applications
            commands::apps::get_applications,
            commands::apps::refresh_applications_list,
            commands::apps::refresh_applications_list_in_bg,
            // extensions
            commands::extension::load_manifest,
            commands::extension::load_all_extensions,
            // utils
            commands::fs::path_exists,
            // server
            commands::server::start_server,
            commands::server::stop_server,
            commands::server::restart_server,
            commands::server::set_dev_extension_folder,
            commands::server::set_extension_folder,
            commands::server::get_extension_folder,
            commands::server::get_dev_extension_folder,
            commands::server::server_is_running,
            // fs
            commands::fs::decompress_tarball,
            commands::fs::compress_tarball,
        ])
        .setup(|app| {
            app.manage(ApplicationsState::default());
            let mut store = StoreBuilder::new("appConfig.bin").build(app.handle().clone());
            let _ = store.load();

            let app_settings = match AppSettings::load_from_store(&store) {
                Ok(settings) => settings,
                Err(_) => AppSettings::default(),
            };
            let ext_folder: Option<PathBuf> = get_default_extensions_dir(app.handle()).ok();
            app.manage(Server::new(ext_folder, app_settings.dev_extention_path));
            // app.manage(ApplicationsState::default());
            utils::setup::setup_server(app.handle());

            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            utils::setup::setup_app_path(&app.handle());
            // let window = app.get_webview_window("main").unwrap();
            // #[cfg(target_os = "macos")]
            // apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
            //     .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
