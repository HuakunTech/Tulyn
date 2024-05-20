use applications::utils::image::{RustImage, RustImageData};
use std::{ffi::OsStr, fs::File, io::BufReader, path::PathBuf};
use tauri_icns::{IconFamily, IconType};

pub fn load_icns(icns_path: &PathBuf) -> anyhow::Result<RustImageData> {
    if icns_path.extension().unwrap_or(OsStr::new("")).to_str().unwrap() != "icns" {
        return Err(anyhow::anyhow!("file is not an icns file"));
    }
    let file = BufReader::new(File::open(icns_path).unwrap());
    let icon_family = IconFamily::read(file).unwrap();
    let mut largest_icon_type = IconType::Mask8_16x16;
    let mut largest_width = 0;
    for icon_type in icon_family.available_icons() {
        let icon_type_width = icon_type.pixel_width();
        if icon_type_width > largest_width {
            largest_width = icon_type_width;
            largest_icon_type = icon_type;
            if largest_width >= 64 {
                // width 64 is large enough
                break;
            }
        }
    }
    let largest_icon = icon_family.get_icon_with_type(largest_icon_type)?;
    let bytes = largest_icon.data();
    match RustImageData::from_bytes(bytes) {
        Ok(image) => Ok(image),
        Err(error) => Err(anyhow::anyhow!(error)),
    }
}
