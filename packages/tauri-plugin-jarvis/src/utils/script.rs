use std::process::Command;

pub fn run_apple_script(script: &str) -> anyhow::Result<String> {
    let output = Command::new("osascript")
        .arg("-e")
        .arg(script)
        .output()
        .expect("failed to execute applescript");
    match output.status.success() {
        true => Ok(String::from_utf8_lossy(&output.stdout).to_string()),
        false => Err(anyhow::anyhow!(
            "failed to execute applescript: {}",
            String::from_utf8_lossy(&output.stderr)
        )),
    }
}

pub fn run_powershell(script: &str) -> anyhow::Result<String> {
    let output = Command::new("powershell")
        .arg("-Command")
        .arg(script)
        .output()
        .expect("failed to execute powershell");
    match output.status.success() {
        true => Ok(String::from_utf8_lossy(&output.stdout).to_string()),
        false => Err(anyhow::anyhow!(
            "failed to execute powershell: {}",
            String::from_utf8_lossy(&output.stderr)
        )),
    }
}

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use std::process::Command;
//     #[test]
//     fn run_shell_script() {
//         let mut output = Command::new("ls")
//             .arg("-l")
//             .arg("-a")
//             .spawn()
//             .expect("ls command failed to start");
//         assert!(output.wait().is_ok());

//         // run a ffmpeg command to compress a video and get stdout stream
//         let output = Command::new("ffmpeg")
//             .arg("-i")
//             .arg("input.mp4")
//             .arg("output.mp4")
//             .output()
//             .expect("failed to execute ffmpeg");

//     }
// }
