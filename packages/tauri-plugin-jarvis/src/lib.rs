use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

use std::{collections::HashMap, sync::Mutex};

pub use models::*;
pub mod utils;
pub mod model;
pub mod syscmds;
pub mod server;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::Jarvis;
#[cfg(mobile)]
use mobile::Jarvis;

#[derive(Default)]
struct MyState(Mutex<HashMap<String, String>>);

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
    .invoke_handler(tauri::generate_handler![])
    .setup(|app, api| {
      #[cfg(mobile)]
      let jarvis = mobile::init(app, api)?;
      #[cfg(desktop)]
      let jarvis = desktop::init(app, api)?;
      app.manage(jarvis);

      // manage state so it is accessible by the commands
      app.manage(MyState::default());
      Ok(())
    })
    .build()
}
