use tauri::Runtime;

#[tauri::command]
pub fn open_devtools<R: Runtime>(window: tauri::Window<R>) -> Result<(), String> {
    #[cfg(debug_assertions)]
    {
        window.open_devtools();
    }
    Ok(())
}

#[tauri::command]
pub fn close_devtools<R: Runtime>(window: tauri::Window<R>) -> Result<(), String> {
    #[cfg(debug_assertions)]
    {
        window.close_devtools();
    }
    Ok(())
}

#[tauri::command]
pub fn is_devtools_open<R: Runtime>(window: tauri::Window<R>) -> Result<bool, String> {
    #[cfg(debug_assertions)]
    {
        return Ok(window.is_devtools_open());
    }
    return Err("Devtools is not available in release mode".to_string());
}

#[tauri::command]
pub fn toggle_devtools<R: Runtime>(window: tauri::Window<R>) -> Result<(), String> {
    #[cfg(debug_assertions)]
    {
        let is_open =
            is_devtools_open(window.clone()).expect("failed to check if devtools is open");
        if is_open {
            close_devtools(window).expect("failed to close devtools");
        } else {
            open_devtools(window).expect("failed to open devtools");
        }
    }
    Ok(())
}
