
// use std::fs::File;
// use flate2::read::GzDecoder;
// use tar::Archive;

// fn main() -> Result<(), std::io::Error> {
//     let path = "/Users/hacker/Downloads/qrcode.tar.gz";

//     let tar_gz = File::open(path)?;
//     let tar = GzDecoder::new(tar_gz);
//     let mut archive = Archive::new(tar);
//     archive.unpack("/Users/hacker/Downloads/")?;

//     Ok(())
// }


use std::fs::File;
use flate2::Compression;
use flate2::write::GzEncoder;

fn main() -> Result<(), std::io::Error> {
    let tar_gz = File::create("/Users/hacker/Downloads/archive.tar.gz")?;
    let enc = GzEncoder::new(tar_gz, Compression::default());
    let mut tar = tar::Builder::new(enc);
    tar.append_dir_all("qrcode", "/Users/hacker/Desktop/qrcode")?;
    Ok(())
}
