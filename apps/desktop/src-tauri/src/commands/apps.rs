use applications::{App, AppInfo, AppInfoContext};

#[tauri::command]
pub async fn get_applications() -> Result<Vec<App>, String> {
    let mut ctx = AppInfoContext::new();
    ctx.refresh_apps().unwrap(); // must refresh apps before getting them
    Ok(ctx.get_all_apps())
}
