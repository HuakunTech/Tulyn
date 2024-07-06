use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Ext {
    pub ext_id: i32,
    pub identifier: String,
    pub version: String,
    pub alias: Option<String>,
    pub hotkey: Option<String>,
    pub is_enabled: bool,
    pub installed_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ExtData {
    pub data_id: i32,
    pub ext_id: i32,
    pub data_type: String,
    pub data: String,
    pub search_text: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}
