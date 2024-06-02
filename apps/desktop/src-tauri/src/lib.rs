use std::path::PathBuf;
use tauri_plugin_log::{fern::colors::ColoredLevelConfig, Target as LogTarget, TargetKind};

mod log;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> anyhow::Result<()> {
    let log_targets = log::get_log_targets();
    // generate a filename for log with date and time created
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_http::init())
        .register_uri_scheme_protocol("macicns", |_app, request| {
            let url = &request.uri().path()[1..];
            let url = urlencoding::decode(url).unwrap().to_string();
            let path = PathBuf::from(url);
            return tauri_plugin_jarvis::utils::icns::load_icon(path);
        })
        // .register_uri_scheme_protocol("extasset", |_app, request| {
        //     let url = &request.uri().path()[1..];
        //     // let url = url.replace("%2F", "/").replace("%20", " ");
        //     let url = urlencoding::decode(url).unwrap().to_string();
        //     let path = PathBuf::from(url);
        //     println!("path: {:?}", path);
        //     if !path.exists() {
        //         return tauri::http::Response::builder()
        //             .status(tauri::http::StatusCode::NOT_FOUND)
        //             .body("file not found".as_bytes().to_vec())
        //             .unwrap();
        //     }
        //     let bytes = std::fs::read(&path).unwrap();
        //     tauri::http::Response::builder().body(bytes).unwrap()
        // })
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        // .plugin(
        //     tauri_plugin_global_shortcut::Builder::new()
        //         .with_shortcuts(["option+space"])?
        //         .build(),
        // )
        // .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                // .format(|buf, argrecord| {
                //     writeln!(
                //         buf,
                //         "{} [{}] - {}",
                //         Local::now().format("%Y-%m-%dT%H:%M:%S"),
                //         record.level(),
                //         record.args()
                //     )
                // })
                .targets(log_targets)
                .level(log::get_log_level())
                .with_colors(ColoredLevelConfig::default())
                .max_file_size(10_000_000) // max 10MB
                .build(),
        )
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_jarvis::init())
        .setup(|app| {
            log::clear_old_log_files(app.handle()).unwrap();
            // app.manage(ApplicationsState::default());
            // let mut store = StoreBuilder::new("appConfig.bin").build(app.handle().clone());
            // let _ = store.load();

            // let app_settings = match AppSettings::load_from_store(&store) {
            //     Ok(settings) => settings,
            //     Err(_) => AppSettings::default(),
            // };
            // let ext_folder: Option<PathBuf> = get_default_extensions_dir(app.handle()).ok();
            // app.manage(Server::new(ext_folder, app_settings.dev_extention_path));
            // // app.manage(ApplicationsState::default());
            // utils::setup::setup_server(app.handle());

            // // #[cfg(debug_assertions)] // only include this code on debug builds
            // // {
            // //     let window = app.get_webview_window("main").unwrap();
            // //     window.open_devtools();
            // // }
            // utils::setup::setup_app_path(app.handle());
            /* -------------------------------------------------------------------------- */
            /*                                  Shortcut                                  */
            /* -------------------------------------------------------------------------- */
            // app.handle().plugin(
            //     tauri_plugin_global_shortcut::Builder::new()
            //         .with_shortcuts(["alt+space"])?
            //         .with_handler(|app, shortcut, event| {
            //             if event.state == ShortcutState::Pressed {
            //                 // if shortcut.matches(Modifiers::CONTROL, Code::KeyD) {
            //                 //     let _ = app.emit("shortcut-event", "Ctrl+D triggered");
            //                 // }
            //                 if shortcut.matches(Modifiers::ALT, Code::Space) {
            //                     // println!("Alt+Space triggered");
            //                     // app.show().unwrap();
            //                     let window = app.get_webview_window("main").unwrap();
            //                     let is_focused = window.is_focused().unwrap();
            //                     let is_visible = window.is_visible().unwrap();
            //                     // println!("is_focused: {:?}", is_focused);
            //                     // println!("is_visible: {:?}", is_visible);
            //                     // println!("fs_scope allowed: {:?}", fs_scope.allowed());
            //                     if !is_visible || !is_focused {
            //                         window.show().unwrap();
            //                     } else {
            //                         window.hide().unwrap();
            //                     }
            //                     // let _ = app.emit("shortcut-event", "Alt+Space triggered");
            //                 }
            //             }
            //         })
            //         .build(),
            // )?;
            // let window = app.get_webview_window("main").unwrap();
            // #[cfg(target_os = "macos")]
            // apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
            //     .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
