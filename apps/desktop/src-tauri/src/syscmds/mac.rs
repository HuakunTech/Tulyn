use super::CommonSystemCmds;

pub struct SystemCmds;

impl CommonSystemCmds  for SystemCmds {
    fn open_trash(&self) -> anyhow::Result<()> {
        todo!()
    }

    fn empty_trash(&self) -> anyhow::Result<()> {
        todo!()
    }

    fn shutdown(&self) -> anyhow::Result<()> {
        todo!()
    }

    fn reboot(&self) -> anyhow::Result<()> {
        todo!()
    }

    fn sleep(&self) -> anyhow::Result<()> {
        todo!()
    }

    fn set_volume(&self, percentage: u8) -> anyhow::Result<()> {
        todo!()
    }

    fn turn_volume_up(&self) -> anyhow::Result<()> {
        todo!()
    }

    fn turn_volume_down(&self) -> anyhow::Result<()> {
        todo!()
    }

    fn logout_user(&self) -> anyhow::Result<()> {
        todo!()
    }

    fn toggle_mute(&self) -> anyhow::Result<()> {
        todo!()
    }

    fn mute(&self) -> anyhow::Result<()> {
        todo!()
    }

    fn unmute(&self) -> anyhow::Result<()> {
        todo!()
    }
}