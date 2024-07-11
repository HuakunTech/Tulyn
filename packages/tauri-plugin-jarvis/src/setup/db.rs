use crate::{commands, constants::JARVIS_CLIPBOARD_IDENTIFIER};
use tauri::{AppHandle, Manager, Runtime};

pub fn setup_db<R: Runtime>(app_handle: &AppHandle<R>) -> anyhow::Result<()> {
    let db = app_handle.state::<commands::db::DBState>();
    let db = db.db.lock().unwrap();
    let ext = db.get_extension_by_identifier(JARVIS_CLIPBOARD_IDENTIFIER)?;
    if ext.is_none() {
        db.create_extension(JARVIS_CLIPBOARD_IDENTIFIER, "1.0.0", true)?;
    }
    Ok(())
}
