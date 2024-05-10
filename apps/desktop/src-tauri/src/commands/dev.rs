use tauri::Runtime;

#[tauri::command]
pub async fn open_dev_tool<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
) -> Result<(), String> {
    window.open_devtools();
    Ok(())
}
