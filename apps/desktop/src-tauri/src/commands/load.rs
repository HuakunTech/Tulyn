use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};

#[derive(Debug, Serialize, Deserialize)]
pub struct JarvisManifest {
    ui: Option<String>,
    identifier: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PackageJson {
    name: String,
    version: String,
    description: String,
    jarvis: JarvisManifest,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExtInfo {
    name: String,
    path: String,
    package_json: PackageJson,
}

#[tauri::command]
pub fn get_extensions_info() -> Result<Vec<ExtInfo>, String> {
    let extensions_folder = PathBuf::from("../../../dev/extensions");
    let mut extensions_info = vec![];
    // list all files in the extensions folder
    let entries = fs::read_dir(extensions_folder).unwrap();
    for entry in entries {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.is_file() {
            continue;
        }

        let name = path
            .file_name()
            .ok_or("Invalid extension folder name")
            .map_err(|e| e.to_string())
            .map_err(|e| e.to_string())?
            .to_string_lossy()
            .to_string();
        // read package.json file
        let package_json_path = path.join("package.json");
        println!("package_json_path: {:?}", package_json_path);
        let package_json_content =
            fs::read_to_string(package_json_path).map_err(|e| e.to_string())?;
        let package_json: PackageJson =
            serde_json::from_str(&package_json_content).map_err(|e| e.to_string())?;

        extensions_info.push(ExtInfo {
            name,
            path: path.to_str().unwrap().to_string(),
            package_json,
        });
    }
    Ok(extensions_info)
}
