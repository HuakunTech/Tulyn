fn main() {
    // let out_dir = std::path::PathBuf::from(std::env::var("OUT_DIR").unwrap());
    // tonic_build::configure()
    //     .file_descriptor_set_path(out_dir.join("helloworld_descriptor.bin"))
    //     .compile(&["proto/helloworld.proto"], &["proto"])
    //     .expect("Failed to compile protos");
    tauri_build::build();
    // tonic_build::compile_protos("proto/helloworld.proto").expect("Failed to compile protos");
}
