// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
pub mod commands;
mod setup;
use tauri_plugin_jarvis::{
    db::JarvisDB,
    server::Protocol,
    utils::{
        path::{get_default_extensions_dir, get_kunkun_db_path},
        settings::AppSettings,
    },
};
use tauri_plugin_store::StoreBuilder;
pub mod utils;
use log;
#[cfg(target_os = "macos")]
use tauri::ActivationPolicy;
use tauri::Manager;
pub use tauri_plugin_log::fern::colors::ColoredLevelConfig;

fn main() {
    let context = tauri::generate_context!();
    let shell_unlocked = true;
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
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
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shellx::init(shell_unlocked))
        .plugin(tauri_plugin_jarvis::init())
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_network::init())
        .plugin(tauri_plugin_system_info::init())
        // .invoke_handler(tauri::generate_handler![])
        .register_uri_scheme_protocol("appicon", |_app, request| {
            let url = &request.uri().path()[1..];
            let url = urlencoding::decode(url).unwrap().to_string();
            let path = PathBuf::from(url);
            return tauri_plugin_jarvis::utils::icns::load_icon(path);
        })
        .register_uri_scheme_protocol("ext", |_app, request| {
            println!("ext request: {}", request.uri());
            println!("ext request path: {}", request.uri().path());
            println!("ext authority: {:?}", request.uri().authority());
            println!("ext host: {:?}", request.uri().host());
            let host = request.uri().host().unwrap();
            let host_parts: Vec<&str> = host.split(".").collect();
            // expect 2 parts, ext_identifier and ext_type
            let ext_identifier = host_parts[0];
            println!("ext_identifier: {}", ext_identifier);
            let ext_type = host_parts[1]; // ext or dev-ext
                                          // let extension_folder_path = match ext_type {
                                          //     "ext" => get_default_extensions_dir(app.handle()).unwrap(),
                                          //     "dev-ext" =>
                                          // };
            let extension_folder_path =
                PathBuf::from("/Users/hacker/Dev/projects/kunkun/kunkun/templates");
            let path = &request.uri().path()[1..]; // skip the first /
            println!("path: {}", path);
            let ext_path = extension_folder_path.join(ext_identifier);
            println!("ext_path: {:?}", ext_path);
            let url_file_path = ext_path.join("build");
            let url_file_path = url_file_path.join(path);
            println!("url_file_path: {:?}", url_file_path);
            // check if it's file or directory, if file and exist, return file, if directory, return index.html, if neither, check .html
            if url_file_path.is_file() {
                println!("1st case url_file_path: {:?}", url_file_path);
                let mime_type = match url_file_path.extension().and_then(std::ffi::OsStr::to_str) {
                    Some("js") => "application/javascript",
                    Some("html") => "text/html",
                    Some("css") => "text/css",
                    _ => "application/octet-stream",
                };
                return tauri::http::Response::builder()
                    .status(tauri::http::StatusCode::OK)
                    .header("Access-Control-Allow-Origin", "*")
                    .header("Content-Type", mime_type)
                    .body(std::fs::read(url_file_path).unwrap())
                    .unwrap();
            } else if url_file_path.is_dir() {
                /*
                 * there are two cases:
                 * 1. directory conntains a index.html, then return index.html
                 * 2. directory has a sibling file with .html extension, return that file
                 */
                let index_html_path = url_file_path.join("index.html");
                if index_html_path.is_file() {
                    println!("2nd case index_html_path: {:?}", index_html_path);
                    return tauri::http::Response::builder()
                        .status(tauri::http::StatusCode::OK)
                        .header("Access-Control-Allow-Origin", "*")
                        .body(std::fs::read(index_html_path).unwrap())
                        .unwrap();
                }
                // check if path has a sibling file with .html extension
                // get folder name
                let folder_name = url_file_path.file_name().unwrap().to_str().unwrap();
                // check if url_file_path's parent has a file with name folder_name.html
                let parent_path = url_file_path.parent().unwrap();
                let html_file_path = parent_path.join(format!("{}.html", folder_name));
                if html_file_path.is_file() {
                    println!("3rd case html_file_path: {:?}", html_file_path);
                    return tauri::http::Response::builder()
                        .status(tauri::http::StatusCode::OK)
                        .header("Access-Control-Allow-Origin", "*")
                        .body(std::fs::read(html_file_path).unwrap())
                        .unwrap();
                }
            } else {
                // file not found, check if end with .html works. if path ends with /, remove the / and check if adding .html makes a file
                let mut path_str = url_file_path.to_str().unwrap().to_string();
                if path_str.ends_with("/") {
                    path_str.pop();
                }
                path_str.push_str(".html");
                let path_str = PathBuf::from(path_str);
                if path_str.is_file() {
                    println!("4rd case path_str: {:?}", path_str);
                    return tauri::http::Response::builder()
                        .status(tauri::http::StatusCode::OK)
                        .header("Access-Control-Allow-Origin", "*")
                        .body(std::fs::read(path_str).unwrap())
                        .unwrap();
                }
            }
            println!("5th case file not found");
            return tauri::http::Response::builder()
                .status(tauri::http::StatusCode::NOT_FOUND)
                .header("Access-Control-Allow-Origin", "*")
                .body("file not found".as_bytes().to_vec())
                .unwrap();
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
            log::info!("Jarvis Server Port: {}", my_port);
            log::info!(
                "App Settings Dev Extension Path: {:?}",
                app_settings.dev_extension_path,
            );
            log::info!("Extension Folder: {:?}", ext_folder);
            app.manage(tauri_plugin_jarvis::server::http::Server::new(
                app.handle().clone(),
                my_port,
                Protocol::Http,
                ext_folder,
                app_settings.dev_extension_path,
            ));
            tauri_plugin_jarvis::setup::server::setup_server(app.handle())?; // start the server

            let mdns = tauri_plugin_jarvis::setup::peer_discovery::setup_mdns(my_port)?;
            tauri_plugin_jarvis::setup::peer_discovery::handle_mdns_service_evt(
                app.handle(),
                mdns.browse()?,
            );

            /* ----------------------------- Database Setup ----------------------------- */
            // setup::db::setup_db(app)?;
            /* ------------------------- Clipboard History Setup ------------------------ */
            let db_path = get_kunkun_db_path(app.app_handle())?;
            let db_key: Option<String> = None;
            let jarvis_db = JarvisDB::new(db_path.clone(), db_key.clone())?;
            // The clipboard extension should be created in setup_db, ext is guaranteed to be Some
            let ext = jarvis_db.get_extension_by_identifier(
                tauri_plugin_jarvis::constants::KUNKUN_CLIPBOARD_EXT_IDENTIFIER,
            )?;

            app.manage(
                tauri_plugin_jarvis::model::clipboard_history::ClipboardHistory::new(
                    jarvis_db,
                    ext.unwrap().ext_id,
                ),
            );
            let (clipboard_update_tx, clipboard_update_rx) = tokio::sync::broadcast::channel::<
                tauri_plugin_jarvis::model::clipboard_history::Record,
            >(10);
            /* --------------------------- Cliipboard Listener -------------------------- */
            setup::clipboard::setup_clipboard_listener(
                &app.app_handle(),
                clipboard_update_tx.clone(),
            );
            app.state::<tauri_plugin_clipboard::Clipboard>()
                .start_monitor(app.app_handle().clone())?;
            setup::clipboard::setup_clipboard_update_handler(app.app_handle(), clipboard_update_rx);

            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
                // window.close_devtools();
            }

            let main_window = app.get_webview_window("main").unwrap();
            std::thread::spawn(move || {
                // this is a backup plan, if frontend is not properly loaded, show() will not be called, then we need to call it manually from rust after a long delay
                std::thread::sleep(std::time::Duration::from_secs(1));
                main_window.show().unwrap();
            });
            Ok(())
        })
        .build(context)
        // .run(tauri::generate_context!())
        .expect("error while running tauri application");
    app.run(|_app_handle, event| match event {
        // tauri::RunEvent::Exit => todo!(),
        // tauri::RunEvent::ExitRequested { code, api, .. } => todo!(),
        // tauri::RunEvent::WindowEvent { label, event, .. } => todo!(),
        // tauri::RunEvent::WebviewEvent { label, event, .. } => todo!(),
        // tauri::RunEvent::Ready => todo!(),
        // tauri::RunEvent::Resumed => todo!(),
        // tauri::RunEvent::MainEventsCleared => todo!(),
        // tauri::RunEvent::Opened { urls } => todo!(),
        // tauri::RunEvent::MenuEvent(_) => todo!(),
        // tauri::RunEvent::TrayIconEvent(_) => todo!(),
        #[cfg(target_os = "macos")]
        tauri::RunEvent::Reopen {
            has_visible_windows,
            ..
        } => {
            _app_handle
                .webview_windows()
                .iter()
                .for_each(|(label, window)| {
                    window.show().unwrap();
                });
            // let main_window = _app_handle.get_webview_window("main").unwrap();
            // main_window.show().unwrap();
        }
        _ => {}
    });
}
