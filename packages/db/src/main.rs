use db::JarvisDB;
use rusqlite::{params, Connection, Result};

fn main() -> Result<()> {
    let db = JarvisDB::new("jarvis.db", None)?;
    db.init()?;
    db.create_plugin("test", "0.1.0", Some("test"), Some("test"))?;
    let plugins = db.get_all_plugins()?;
    for plugin in plugins {
        println!("{:#?}", plugin);
    }
    Ok(())
}
