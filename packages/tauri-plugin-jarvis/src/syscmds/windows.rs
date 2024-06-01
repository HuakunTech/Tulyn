use super::CommonSystemCmds;
use crate::utils::script::{run_apple_script, run_powershell};

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

    /// Get the selected files in the Windows File Explorer
    fn get_selected_files() -> anyhow::Result<Vec<std::path::PathBuf>> {
        let script = r#"
            # Create a COM object for the Shell application
            $shell = New-Object -ComObject Shell.Application
            
            # Get all open Windows Explorer windows
            $windows = $shell.Windows()
            
            # Iterate through each window
            foreach ($window in $windows) {
                # Get the current selection
                $selectedItems = $window.Document.SelectedItems()
                foreach ($item in $selectedItems) {
                    # Print the path of each selected file
                    Write-Output $item.Path
                }
            }
        "#;
        let result = run_powershell(script).unwrap();
        let paths: Vec<std::path::PathBuf> = result
            .split('\n')
            .map(|path| std::path::PathBuf::from(path.trim()))
            .filter(|path| path.exists())
            .collect();
        Ok(paths)
    }
}
