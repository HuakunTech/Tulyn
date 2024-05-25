use super::CommonSystemCmds;
use crate::commands::utils::run_apple_script;

pub struct SystemCmds;

impl CommonSystemCmds for SystemCmds {
    fn open_trash() -> anyhow::Result<()> {
        todo!()
    }

    fn empty_trash() -> anyhow::Result<()> {
        todo!()
    }

    fn shutdown() -> anyhow::Result<()> {
        todo!()
    }

    fn reboot() -> anyhow::Result<()> {
        todo!()
    }

    fn sleep() -> anyhow::Result<()> {
        todo!()
    }

    fn set_volume(percentage: u8) -> anyhow::Result<()> {
        todo!()
    }

    fn turn_volume_up() -> anyhow::Result<()> {
        todo!()
    }

    fn turn_volume_down() -> anyhow::Result<()> {
        todo!()
    }

    fn logout_user() -> anyhow::Result<()> {
        todo!()
    }

    fn toggle_mute() -> anyhow::Result<()> {
        todo!()
    }

    fn mute() -> anyhow::Result<()> {
        todo!()
    }

    fn unmute() -> anyhow::Result<()> {
        todo!()
    }
}
