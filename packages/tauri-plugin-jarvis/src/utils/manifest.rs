use crate::model::manifest::{ExtPackageJson, MANIFEST_FILE_NAME};
use anyhow::Result;
use std::path::PathBuf;

pub fn load_jarvis_ext_manifest(manifest_path: PathBuf) -> Result<ExtPackageJson> {
    // check if it's a folder

    let manifest_path = if manifest_path.is_file() && manifest_path.ends_with(MANIFEST_FILE_NAME) {
        manifest_path
    } else {
        manifest_path.join(MANIFEST_FILE_NAME)
    };
    // check if file exists
    if !std::path::Path::new(&manifest_path).exists() {
        return Err(anyhow::Error::msg(format!(
            "{} not found",
            manifest_path.to_string_lossy()
        )));
    }
    ExtPackageJson::load(manifest_path)
}
