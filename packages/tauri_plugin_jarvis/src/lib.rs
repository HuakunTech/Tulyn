pub mod dev;
pub mod system;
pub mod utils;
use serde::{ser::Serializer, Serialize};
use tauri::{
    command,
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, Runtime, State, Window,
};

use std::{collections::HashMap, sync::Mutex};

type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[derive(Default)]
struct MyState(Mutex<HashMap<String, String>>);

#[command]
async fn execute<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, MyState>,
) -> Result<String> {
    state.0.lock().unwrap().insert("key".into(), "value".into());
    Ok("success".to_string())
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("jarvis")
        .invoke_handler(tauri::generate_handler![
            execute,
            dev::open_devtools,
            dev::close_devtools,
            dev::is_devtools_open,
            dev::toggle_devtools,
            system::open_trash,
            system::empty_trash,
            system::shutdown,
            system::reboot,
            system::sleep,
            system::lock,
            system::toggle_system_appearance,
            system::show_desktop,
            system::quit_app_apps,
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
        ])
        .setup(|app| {
            app.manage(MyState::default());
            Ok(())
        })
        .build()
}
