#[tauri::command]
pub async fn plist_to_json(plist_content: String) -> Result<String, String> {
    crate::utils::plist::plist_to_json(plist_content)
}
