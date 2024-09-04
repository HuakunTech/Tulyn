pub fn plist_to_json(plist_content: String) -> Result<String, String> {
    let reader = std::io::Cursor::new(plist_content.as_bytes());
    let parsed_plist = plist::Value::from_reader(reader).expect("Failed to parse plist file");
    let json_string =
        serde_json::to_string_pretty(&parsed_plist).expect("Failed to convert plist to json");
    Ok(json_string)
}
