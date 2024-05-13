pub mod apps;
pub mod dev;
pub mod system;
pub mod utils;
use apps::ApplicationsState;
use serde::{ser::Serializer, Serialize};
use tauri::{
    command,
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, Runtime, State, Window,
};

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("jarvis")
        .invoke_handler(tauri::generate_handler![
            dev::open_devtools,
            dev::close_devtools,
            dev::is_devtools_open,
            dev::toggle_devtools,
            system::open_trash,
            system::empty_trash,
            system::shutdown,
            system::reboot,
            system::sleep,
            system::toggle_system_appearance,
            system::show_desktop,
            system::quit_all_apps,
            system::sleep_displays,
            system::set_volume,
            system::turn_volume_up,
            system::turn_volume_down,
            system::toggle_stage_manager,
            system::toggle_bluetooth,
            system::toggle_hidden_files,
            system::eject_all_disks,
            system::logout_user,
            system::toggle_mute,
            system::mute,
            system::unmute,
            system::hide_all_apps_except_frontmost,
            apps::get_applications,
            apps::refresh_applications_list,
            apps::refresh_applications_list_in_bg
        ])
        .setup(|app| {
            app.manage(ApplicationsState::default());
            Ok(())
        })
        .build()
}
