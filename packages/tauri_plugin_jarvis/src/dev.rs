use tauri::Runtime;

#[tauri::command]
pub fn open_devtools<R: Runtime>(window: tauri::Window<R>) -> Result<(), String> {
    // debug only
    #[cfg(debug_assertions)]
    {
        window.open_devtools();
    }
    Ok(())
}
