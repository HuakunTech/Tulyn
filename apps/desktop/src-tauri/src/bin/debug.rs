use std::path::PathBuf;

fn main() {
    let path = PathBuf::from("/Applications/Visual Studio Code.app/Contents/Resources/Code.icns");
    let ext = path.extension().unwrap().to_str().unwrap();
    println!("path: {:?}", ext);
}