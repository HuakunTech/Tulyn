use std::process::Command;

#[tauri::command]
pub fn run_apple_script(script: &str) -> anyhow::Result<()> {
    let output = Command::new("osascript")
        .arg("-e")
        .arg(script)
        .output()
        .expect("failed to execute applescript");
    match output.status.success() {
        true => Ok(()),
        false => Err(anyhow::anyhow!(
            "failed to execute applescript: {}",
            String::from_utf8_lossy(&output.stderr)
        )),
    }
}
