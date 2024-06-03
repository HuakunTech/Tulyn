use std::process::Command;

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct ScriptOutput {
    pub stdout: String,
    pub stderr: String,
}

pub fn run_script(command: &str, args: Vec<&str>) -> anyhow::Result<ScriptOutput> {
    let output = Command::new(command)
        .args(args)
        .output()
        .expect("failed to execute script");
    match output.status.success() {
        true => Ok(ScriptOutput {
            stdout: String::from_utf8_lossy(&output.stdout).to_string(),
            stderr: String::from_utf8_lossy(&output.stderr).to_string(),
        }),
        false => Err(anyhow::anyhow!(
            "failed to execute script: {}",
            String::from_utf8_lossy(&output.stderr)
        )),
    }
}

pub fn run_apple_script(script: &str) -> anyhow::Result<ScriptOutput> {
    run_script("osascript", vec!["-e", script])
}

pub fn run_powershell(script: &str) -> anyhow::Result<ScriptOutput> {
    run_script("powershell", vec!["-Command", script])
}

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use std::process::Command;
//     #[test]
//     fn run_shell_script() {
//         let res = run_script("bash", "-c", r#""#).unwrap();
//         println!("{}", res);
//         // let mut output = Command::new("ls")
//         //     .arg("-l")
//         //     .arg("-a")
//         //     .spawn()
//         //     .expect("ls command failed to start");
//         // assert!(output.wait().is_ok());

//         // // run a ffmpeg command to compress a video and get stdout stream
//         // let output = Command::new("ffmpeg")
//         //     .arg("-i")
//         //     .arg("input.mp4")
//         //     .arg("output.mp4")
//         //     .output()
//         //     .expect("failed to execute ffmpeg");
//     }
// }
