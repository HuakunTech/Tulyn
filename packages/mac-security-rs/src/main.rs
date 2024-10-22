use mac_security_rs::{
    preflight_screen_capture_access, request_screen_capture_access, verify_auth, AuthPolicy,
};

fn main() {
    // println!("{}", request_screen_capture_access());
    println!("{}", verify_auth(AuthPolicy::Biometrics));
}
