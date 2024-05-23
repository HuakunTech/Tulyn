use crate::{
    model::manifest::{ExtPackageJsonExtra, MANIFEST_FILE_NAME},
    utils::manifest::load_jarvis_ext_manifest,
};
use std::path::PathBuf;
use tauri::Runtime;

/// manifest_path can be folder of jarvis.ext.json
/// If it's a folder, join it with jarvis.ext.json
#[tauri::command]
pub async fn load_manifest<R: Runtime>(
    _app: tauri::AppHandle<R>,
    _window: tauri::Window<R>,
    manifest_path: PathBuf,
) -> Result<ExtPackageJsonExtra, String> {
    Ok(ExtPackageJsonExtra::from(
        load_jarvis_ext_manifest(manifest_path.clone()).map_err(|e| e.to_string())?,
        manifest_path.parent().unwrap().to_path_buf(),
    ))
}

#[tauri::command]
pub async fn load_all_extensions<R: Runtime>(
    _app: tauri::AppHandle<R>,
    _window: tauri::Window<R>,
    extensions_folder: PathBuf,
) -> Result<Vec<ExtPackageJsonExtra>, String> {
    let mut extensions_with_path: Vec<ExtPackageJsonExtra> = vec![];
    for entry in std::fs::read_dir(extensions_folder).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;

        if entry.path().join(MANIFEST_FILE_NAME).exists() {
            let ext_manifest = load_jarvis_ext_manifest(entry.path()).map_err(|e| e.to_string());
            if ext_manifest.is_err() {
                continue;
            }
            extensions_with_path.push(ExtPackageJsonExtra::from(
                ext_manifest.unwrap(),
                entry.path(),
            ));
        }
    }
    Ok(extensions_with_path)
}
