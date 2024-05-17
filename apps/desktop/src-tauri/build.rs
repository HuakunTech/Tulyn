fn main() {
    tauri_build::build();
    tonic_build::compile_protos("proto/helloworld.proto").expect("Failed to compile protos");
}
