use flate2::read::GzDecoder;
use std::fs::File;
use std::io;
use std::path::{Path, PathBuf};
use tar::Archive;

fn decompress_tar_gz(file_path: &str, output_dir: &str) -> io::Result<Vec<String>> {
    let file = File::open(file_path)?;
    let tar_gz = GzDecoder::new(file);
    let mut archive = Archive::new(tar_gz);

    let mut extracted_files = Vec::new();

    archive.unpack(output_dir)?;

    for entry in archive.entries()? {
        let entry = entry?;
        let path = entry.path()?;
        let full_path = Path::new(output_dir).join(path);
        extracted_files.push(full_path.to_string_lossy().to_string());
    }

    Ok(extracted_files)
}

fn main() -> io::Result<()> {
    let file_path = PathBuf::from("/Users/hacker/Downloads/qrcode.tar.gz");
    // println!("file_path: {:?}", file_path.ends_with(".tar.gz"));
    println!("file_path: {:?}", file_path.file_stem());
    println!("file_path: {:?}", file_path.file_stem());
    // let output_dir = "/Users/hacker/Downloads/";

    // match decompress_tar_gz(file_path, output_dir) {
    //     Ok(files) => {
    //         for file in files {
    //             println!("Extracted: {}", file);
    //         }
    //     }
    //     Err(e) => eprintln!("Error: {}", e),
    // }

    Ok(())
}

// use std::fs::File;
// use flate2::Compression;
// use flate2::write::GzEncoder;

// fn main() -> Result<(), std::io::Error> {
//     let tar_gz = File::create("/Users/hacker/Downloads/archive.tar.gz")?;
//     let enc = GzEncoder::new(tar_gz, Compression::default());
//     let mut tar = tar::Builder::new(enc);
//     tar.append_dir_all("qrcode", "/Users/hacker/Desktop/qrcode")?;
//     Ok(())
// }
