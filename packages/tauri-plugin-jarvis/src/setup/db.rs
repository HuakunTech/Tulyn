use crate::{
    commands,
    constants::{
        JARVIS_CLIPBOARD_EXT_IDENTIFIER, JARVIS_DEV_EXT_IDENTIFIER,
        JARVIS_QUICK_LINKS_EXT_IDENTIFIER, JARVIS_REMOTE_EXT_IDENTIFIER,
        JARVIS_SCRIPT_CMD_EXT_IDENTIFIER,
    },
};
use tauri::{AppHandle, Manager, Runtime};

fn create_ext_if_not_exist(identifier: &str, db: &db::JarvisDB) -> anyhow::Result<()> {
    let ext = db.get_extension_by_identifier(identifier)?;
    if ext.is_none() {
        db.create_extension(identifier, "1.0.0", true)?;
        log::info!("Created extension: {}", identifier)
    }
    Ok(())
}

pub fn setup_db<R: Runtime>(app_handle: &AppHandle<R>) -> anyhow::Result<()> {
    let db = app_handle.state::<commands::db::DBState>();
    let db = db.db.lock().unwrap();
    create_ext_if_not_exist(JARVIS_CLIPBOARD_EXT_IDENTIFIER, &db)?;
    create_ext_if_not_exist(JARVIS_QUICK_LINKS_EXT_IDENTIFIER, &db)?;
    create_ext_if_not_exist(JARVIS_REMOTE_EXT_IDENTIFIER, &db)?;
    create_ext_if_not_exist(JARVIS_SCRIPT_CMD_EXT_IDENTIFIER, &db)?;
    create_ext_if_not_exist(JARVIS_DEV_EXT_IDENTIFIER, &db)?;
    Ok(())
}
