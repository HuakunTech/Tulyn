use flate2::read::GzDecoder;
use std::fs::File;
use std::io::BufReader;
use tar::Archive;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Open the tarball file
    let tar_gz = File::open("/Users/hacker/Downloads/qrcode.tar.gz")?;

    // Create a GzDecoder to handle gzip decompression
    let tar = GzDecoder::new(BufReader::new(tar_gz));

    // Create a tar Archive
    let mut archive = Archive::new(tar);

    // Extract the archive to a specified directory
    let output_dir = "/Users/hacker/Downloads";
    archive.unpack(output_dir)?;

    // Find the top-level directory in the extracted files
    let mut top_level_dirs = std::fs::read_dir(output_dir)?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let metadata = entry.metadata().ok()?;
            if metadata.is_dir() {
                Some(entry.path())
            } else {
                None
            }
        })
        .collect::<Vec<_>>();

    if top_level_dirs.len() == 1 {
        println!("Extracted to directory: {:?}", top_level_dirs[0]);
    } else {
        println!("Extracted to multiple top-level directories");
        for dir in top_level_dirs {
            println!("{:?}", dir);
        }
    }

    Ok(())
}
