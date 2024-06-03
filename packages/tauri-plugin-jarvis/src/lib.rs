use model::extension::Extension;
pub use models::*;
use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};
pub mod commands;
pub mod model;
pub mod server;
pub mod syscmds;
pub mod utils;

// use commands::{apps::ApplicationsState, server::Server};
use std::{collections::HashMap, path::PathBuf, sync::Mutex};
use tauri_plugin_store::StoreBuilder;
use utils::{path::get_default_extensions_dir, settings::AppSettings};

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

// mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::Jarvis;
#[cfg(mobile)]
use mobile::Jarvis;

#[derive(Default)]
pub struct JarvisState {
    pub window_label_ext_map: Mutex<HashMap<String, Extension>>,
}

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the jarvis APIs.
pub trait JarvisExt<R: Runtime> {
    fn jarvis(&self) -> &Jarvis<R>;
}

impl<R: Runtime, T: Manager<R>> crate::JarvisExt<R> for T {
    fn jarvis(&self) -> &Jarvis<R> {
        self.state::<Jarvis<R>>().inner()
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("jarvis")
        .invoke_handler(tauri::generate_handler![
            // dev commands
            commands::dev::open_devtools,
            commands::dev::close_devtools,
            commands::dev::is_devtools_open,
            commands::dev::toggle_devtools,
            commands::dev::app_is_dev,
            // path commands
            commands::path::get_default_extensions_dir,
            commands::path::get_default_extensions_storage_dir,
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
            commands::system::get_frontmost_app,
            commands::system::get_selected_files_in_file_explorer,
            // run scripts
            commands::utils::run_apple_script,
            commands::utils::run_powershell,
            commands::utils::run_script,
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
            // extensions
            commands::extension::is_window_label_registered,
            commands::extension::register_extension_window,
            commands::extension::unregister_extension_window,
            commands::extension::get_ext_label_map,
            // extension storage API wrapper
            commands::storage::ext_store_wrapper_set,
            commands::storage::ext_store_wrapper_get,
            commands::storage::ext_store_wrapper_has,
            commands::storage::ext_store_wrapper_delete,
            commands::storage::ext_store_wrapper_clear,
            commands::storage::ext_store_wrapper_reset,
            commands::storage::ext_store_wrapper_keys,
            commands::storage::ext_store_wrapper_values,
            commands::storage::ext_store_wrapper_entries,
            commands::storage::ext_store_wrapper_length,
            commands::storage::ext_store_wrapper_load,
            commands::storage::ext_store_wrapper_save,
        ])
        .setup(|app, api| {
            // #[cfg(mobile)]
            // let jarvis = mobile::init(app, api)?;
            #[cfg(desktop)]
            let jarvis = desktop::init(app, api)?;
            app.manage(jarvis);

            // manage state so it is accessible by the commands
            app.manage(JarvisState::default());
            app.manage(commands::apps::ApplicationsState::default());

            let mut store = StoreBuilder::new("appConfig.bin").build(app.clone());
            let _ = store.load();

            let app_settings = match AppSettings::load_from_store(&store) {
                Ok(settings) => settings,
                Err(_) => AppSettings::default(),
            };
            let ext_folder: Option<PathBuf> = get_default_extensions_dir(app).ok();
            app.manage(commands::server::Server::new(
                ext_folder,
                app_settings.dev_extention_path,
            ));
            utils::setup::setup_server(app); // start the server
            utils::setup::setup_app_path(app);
            utils::setup::setup_extension_storage(app);
            Ok(())
        })
        .build()
}
