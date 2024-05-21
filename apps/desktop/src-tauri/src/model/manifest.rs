use serde_derive::Deserialize;
use serde_derive::Serialize;
use serde_json::Value;
use std::path::PathBuf;

pub const MANIFEST_FILE_NAME: &str = "jarvis.ext.json";

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum IconType {
    Iconify,
    AssetPath,
}

impl Default for IconType {
    fn default() -> Self {
        IconType::Iconify
    }
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
    pub name: String,
    pub version: String,
    pub description: String,
    pub identifier: String,
    pub demo_images: Vec<Value>,
    pub ui_cmds: Vec<UiCmd>,
    pub inline_cmds: Vec<InlineCmd>,
    pub icon: Icon,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JarvisExtManifestExtra {
    pub name: String,
    pub version: String,
    pub description: String,
    pub identifier: String,
    pub demo_images: Vec<Value>,
    pub ui_cmds: Vec<UiCmd>,
    pub inline_cmds: Vec<InlineCmd>,
    pub icon: Icon,
    // extra fields
    pub ext_path: PathBuf,
    pub ext_folder_name: String,
}

impl JarvisExtManifestExtra {
    pub fn from(manifest: JarvisExtManifest, ext_path: PathBuf) -> Self {
        Self {
            name: manifest.name,
            version: manifest.version,
            description: manifest.description,
            identifier: manifest.identifier,
            demo_images: manifest.demo_images,
            ui_cmds: manifest.ui_cmds,
            inline_cmds: manifest.inline_cmds,
            icon: manifest.icon,
            ext_folder_name: ext_path.file_name().unwrap().to_str().unwrap().to_string(),
            ext_path,
        }
    }
}

impl JarvisExtManifest {
    pub fn load(manifest_path: PathBuf) -> anyhow::Result<Self> {
        let manifest_str = std::fs::read_to_string(manifest_path).unwrap();
        Ok(serde_json::from_str(&manifest_str)?)
    }
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UiCmd {
    pub main: String,
    pub name: String,
    pub dev_main: String,
    pub width: Option<u32>,
    pub height: Option<u32>,
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
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_load_extension_manifest() {
        let manifest_paths = vec![
            "../../../packages/extensions/qrcode/jarvis.ext.json",
            "../../../packages/extensions/myip/jarvis.ext.json",
            "../../../packages/extensions/vscode-project-manager/jarvis.ext.json",
        ];
        for manifest_path in manifest_paths {
            let manifest_str = std::fs::read_to_string(manifest_path).unwrap();
            let _: JarvisExtManifest = serde_json::from_str(&manifest_str).unwrap();
        }
    }
}
