use std::path::PathBuf;

/// Decompress a tarball into a destination_folder
/// destination_folder should be a empty folder to avoid being removed
/// The resulting folder is expected to have "package" as its name
/// All .tgz generated with `npm pack` should be decompressed into `package`
pub fn decompress_tarball(
    path: PathBuf,
    destination_folder: PathBuf,
    overwrite: bool,
) -> anyhow::Result<PathBuf> {
    if !path.exists() {
        return Err(anyhow::format_err!("Tarball does not exist: {:?}", path));
    }
    // if destination exists, remove it
    if destination_folder.exists() && overwrite {
        std::fs::remove_dir_all(&destination_folder)?;
    }
    std::fs::create_dir_all(&destination_folder)?;
    let tgz = std::fs::File::open(&path)?;
    let tar = flate2::read::GzDecoder::new(tgz);
    let mut archive = tar::Archive::new(tar);
    let dest = destination_folder.join("package");

    if dest.exists() && !overwrite {
        return Err(anyhow::format_err!(
            "Destination folder already exists: {:?}",
            dest
        ));
    }
    archive.unpack(&destination_folder)?;
    if !dest.exists() {
        return Err(anyhow::format_err!(
            "Failed to unpack tarball to {:?}",
            dest
        ));
    }
    Ok(dest)
}

pub fn compress_tarball(
    src_dir: PathBuf,
    dest_file: PathBuf,
    overwrite: bool,
) -> anyhow::Result<PathBuf> {
    if !src_dir.exists() {
        return Err(anyhow::format_err!(
            "Source directory does not exist: {:?}",
            src_dir
        ));
    }
    if !src_dir.is_dir() {
        return Err(anyhow::format_err!(
            "Source path is not a directory: {:?}",
            src_dir
        ));
    }
    let dest_file = std::fs::canonicalize(dest_file)?;
    if dest_file.exists() && !overwrite {
        return Err(anyhow::format_err!(
            "Destination file already exists: {:?}",
            dest_file
        ));
    }
    let tar_gz = std::fs::File::create(&dest_file)?;
    let enc = flate2::write::GzEncoder::new(tar_gz, flate2::Compression::default());
    let mut tar = tar::Builder::new(enc);
    tar.append_dir_all(src_dir.file_name().unwrap().to_str().unwrap(), &src_dir)?;
    Ok(dest_file)
}

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn test_decompress_tarball() {
//         // this test relies on submodule
//         decompress_tarball(
//             "/Users/hacker/Desktop/huakunshen-jarvis-ext-qrcode-0.0.0.tgz".into(),
//             "/Users/hacker/Desktop/randomfolder".into(),
//             true,
//         )
//         .unwrap();
//     }
// }
