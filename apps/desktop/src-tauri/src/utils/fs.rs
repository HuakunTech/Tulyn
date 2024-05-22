use std::path::PathBuf;

pub fn decompress_tarball(
    path: PathBuf,
    destination_folder: PathBuf,
    overwrite: bool,
) -> anyhow::Result<PathBuf> {
    if !path.exists() {
        return Err(anyhow::format_err!("Tarball does not exist: {:?}", path));
    }
    if !destination_folder.exists() {
        return Err(anyhow::format_err!(
            "Destination folder does not exist: {:?}",
            destination_folder
        ));
    }
    let tar_gz = std::fs::File::open(&path)?;
    let tar = flate2::read::GzDecoder::new(tar_gz);
    let mut archive = tar::Archive::new(tar);
    println!("destination_folder: {:?}", &destination_folder);
    let mut dest_filename: String = path.file_stem().unwrap().to_string_lossy().to_string();
    if dest_filename.ends_with(".tar") {
        dest_filename = dest_filename.replace(".tar", "");
    }
    let dest = destination_folder.join(dest_filename);

    if dest.exists() && !overwrite {
        return Err(anyhow::format_err!(
            "Destination folder already exists: {:?}",
            dest
        ));
    }
    // get decompressed folder path

    println!("unpack to {:?}", &destination_folder);
    println!("expect dest: {:?}", dest);
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
