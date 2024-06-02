fn main() {
    let log_file = format!(
        "jarvis-{}.log",
        chrono::Local::now().format("%Y-%m-%d-%H-%M-%S")
    );
    println!("{}", chrono::Local::now().format("%Y-%m-%d-%H-%M-%S"));
}
