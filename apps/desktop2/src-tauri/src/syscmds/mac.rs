use super::CommonSystemCmds;
use crate::commands::utils::run_apple_script;

pub struct SystemCmds;

impl CommonSystemCmds for SystemCmds {
    fn open_trash() -> anyhow::Result<()> {
        run_apple_script("tell application \"Finder\" to open trash")
    }

    fn empty_trash() -> anyhow::Result<()> {
        run_apple_script("tell application \"Finder\" to empty the trash")
    }

    fn shutdown() -> anyhow::Result<()> {
        run_apple_script("tell application \"System Events\" to shut down")
    }

    fn reboot() -> anyhow::Result<()> {
        run_apple_script("tell application \"System Events\" to restart")
    }

    fn sleep() -> anyhow::Result<()> {
        run_apple_script("tell application \"System Events\" to sleep")
    }

    fn set_volume(percentage: u8) -> anyhow::Result<()> {
        run_apple_script(&format!("set volume output volume {}", percentage))
    }

    fn turn_volume_up() -> anyhow::Result<()> {
        run_apple_script("set volume output volume (output volume of (get volume settings) + 10)")
    }

    fn turn_volume_down() -> anyhow::Result<()> {
        run_apple_script("set volume output volume (output volume of (get volume settings) - 10)")
    }

    fn logout_user() -> anyhow::Result<()> {
        run_apple_script("tell application \"System Events\" to log out")
    }

    fn toggle_mute() -> anyhow::Result<()> {
        run_apple_script("set volume output muted not (output muted of (get volume settings))")
    }

    fn mute() -> anyhow::Result<()> {
        run_apple_script("set volume with output muted")
    }

    fn unmute() -> anyhow::Result<()> {
        run_apple_script("set volume without output muted")
    }
}
