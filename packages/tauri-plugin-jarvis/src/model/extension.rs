use super::manifest::Permissions;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Extension {
    pub path: PathBuf,
    pub identifier: String,
    pub permissions: Vec<Permissions>,
}
