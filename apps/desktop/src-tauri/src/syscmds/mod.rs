#[cfg(target_os = "linux")]
pub use linux::*;
#[cfg(target_os = "macos")]
pub use mac::*;
#[cfg(target_os = "windows")]
pub use windows::*;

use anyhow::Result;

trait CommonSystemCmds {
    fn open_trash(&self) -> Result<()>;
    fn empty_trash(&self) -> Result<()>;
    fn shutdown(&self) -> Result<()>;
    fn reboot(&self) -> Result<()>;
    fn sleep(&self) -> Result<()>;
    fn set_volume(&self, percentage: u8) -> Result<()>;
    fn turn_volume_up(&self) -> Result<()>;
    fn turn_volume_down(&self) -> Result<()>;
    fn logout_user(&self) -> Result<()>;
    fn toggle_mute(&self) -> Result<()>;
    fn mute(&self) -> Result<()>;
    fn unmute(&self) -> Result<()>;
}
