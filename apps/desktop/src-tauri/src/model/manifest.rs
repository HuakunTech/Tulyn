use serde_derive::Deserialize;
use serde_derive::Serialize;
use serde_json::Value;
use std::path::PathBuf;

pub const MANIFEST_FILE_NAME: &str = "package.json";

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum IconType {
    #[default]
    Iconify,
    AssetPath,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum TitleBarStyle {
    #[default]
    Visible,
    Transparent,
    Overlay,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Icon {
    pub icon: String,
    #[serde(rename = "type")]
    pub type_field: IconType,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JarvisExtManifest {
    pub identifier: String,
    pub demo_images: Vec<Value>,
    pub ui_cmds: Vec<UiCmd>,
    pub inline_cmds: Vec<InlineCmd>,
    pub icon: Icon,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PackageJson {
    pub name: String,
    pub version: String,
    pub description: String,
    pub jarvis: JarvisExtManifest,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PackageJsonExtra {
    pub name: String,
    pub version: String,
    pub description: String,
    pub jarvis: JarvisExtManifest,
    // extra fields
    pub ext_path: PathBuf,
    pub ext_folder_name: String,
}

impl PackageJsonExtra {
    pub fn from(manifest: PackageJson, ext_path: PathBuf) -> Self {
        Self {
            name: manifest.name,
            version: manifest.version,
            description: manifest.description,
            jarvis: manifest.jarvis,
            ext_folder_name: ext_path.file_name().unwrap().to_str().unwrap().to_string(),
            ext_path,
        }
    }
}

impl PackageJson {
    pub fn load(manifest_path: PathBuf) -> anyhow::Result<Self> {
        let manifest_str = std::fs::read_to_string(manifest_path).unwrap();
        Ok(serde_json::from_str(&manifest_str)?)
    }
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WindowConfig {
    pub width: Option<u32>,
    pub height: Option<u32>,
    pub title_bar_style: Option<TitleBarStyle>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UiCmd {
    pub main: String,
    pub name: String,
    pub dev_main: String,
    pub window: Option<WindowConfig>,
    pub cmds: Vec<Cmd>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Cmd {
    #[serde(rename = "type")]
    pub type_field: String,
    pub value: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InlineCmd {
    pub main: String,
    pub name: String,
    pub cmds: Vec<Cmd>,
}

// generate test
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_load_extension_manifest() {
        let manifest_paths = vec![
            // "../../../packages/extensions/qrcode/jarvis.ext.json",
            "../../../vendors/extensions/extensions/myip/package.json",
            // "../../../packages/extensions/vscode-project-manager/jarvis.ext.json",
        ];
        for manifest_path in manifest_paths {
            let manifest_str = std::fs::read_to_string(manifest_path).unwrap();
            println!("manifest_str: {}", manifest_str);
            let _: PackageJson = serde_json::from_str(&manifest_str).unwrap();
        }
    }
}
