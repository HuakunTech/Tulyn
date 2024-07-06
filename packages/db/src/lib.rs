pub mod models;
pub mod schema;
use rusqlite::{params, params_from_iter, Connection, Result, ToSql};
use std::path::Path;

pub fn get_connection<P: AsRef<Path>>(
    file_path: P,
    encryption_key: Option<String>,
) -> Result<Connection> {
    let conn = Connection::open(file_path)?;
    if let Some(encryption_key) = encryption_key {
        conn.pragma_update(None, "key", &encryption_key)?;
    }
    Ok(conn)
}

pub struct JarvisDB {
    pub conn: Connection,
}

impl JarvisDB {
    pub fn new<P: AsRef<Path>>(file_path: P, encryption_key: Option<String>) -> Result<Self> {
        let conn = get_connection(file_path, encryption_key)?;
        Ok(Self { conn })
    }

    pub fn init(&self) -> Result<()> {
        self.conn
            .execute_batch(&format!("BEGIN; {} COMMIT;", &schema::SCHEMA))?;
        Ok(())
    }

    /* -------------------------------------------------------------------------- */
    /*                                 Plugin CRUD                                */
    /* -------------------------------------------------------------------------- */

    pub fn create_plugin(
        &self,
        identifier: &str,
        version: &str,
        alias: Option<&str>,
        hotkey: Option<&str>,
    ) -> Result<()> {
        self.conn.execute(
            "INSERT INTO plugins (identifier, version, alias, hotkey) VALUES (?1, ?2, ?3, ?4)",
            params![identifier, version, alias, hotkey],
        )?;
        Ok(())
    }

    pub fn get_all_plugins(&self) -> Result<Vec<models::Plugin>> {
        let mut stmt = self.conn.prepare(
            "SELECT plugin_id, identifier, version, alias, hotkey, is_enabled, installed_at FROM plugins",
        )?;
        let plugin_iter = stmt.query_map(params![], |row| {
            Ok(models::Plugin {
                plugin_id: row.get(0)?,
                identifier: row.get(1)?,
                version: row.get(2)?,
                alias: row.get(3)?,
                hotkey: row.get(4)?,
                is_enabled: row.get(5)?,
                installed_at: row.get(6)?,
            })
        })?;
        let mut plugins = Vec::new();
        for plugin in plugin_iter {
            plugins.push(plugin?);
        }
        Ok(plugins)
    }

    pub fn get_plugin_by_identifier(&self, identifier: &str) -> Result<Option<models::Plugin>> {
        let mut stmt = self.conn.prepare(
            "SELECT plugin_id, identifier, version, alias, hotkey, is_enabled, installed_at FROM plugins WHERE identifier = ?1",
        )?;
        let plugin_iter = stmt.query_map(params![identifier], |row| {
            Ok(models::Plugin {
                plugin_id: row.get(0)?,
                identifier: row.get(1)?,
                version: row.get(2)?,
                alias: row.get(3)?,
                hotkey: row.get(4)?,
                is_enabled: row.get(5)?,
                installed_at: row.get(6)?,
            })
        })?;
        let mut plugins = Vec::new();
        for plugin in plugin_iter {
            plugins.push(plugin?);
        }
        Ok(plugins.first().cloned())
    }

    pub fn delete_plugin_by_identifier(&self, identifier: &str) -> Result<()> {
        self.conn.execute(
            "DELETE FROM plugins WHERE identifier = ?1",
            params![identifier],
        )?;
        Ok(())
    }

    /* -------------------------------------------------------------------------- */
    /*                              Plugin Data CRUD                              */
    /* -------------------------------------------------------------------------- */
    pub fn create_plugin_data(
        &self,
        plugin_id: i32,
        data_type: &str,
        data: &str,
        search_text: Option<&str>,
    ) -> Result<()> {
        self.conn.execute(
            "INSERT INTO plugin_data (plugin_id, data_type, data, search_text) VALUES (?1, ?2, ?3, ?4)",
            params![plugin_id, data_type, data, search_text],
        )?;
        Ok(())
    }

    pub fn get_plugin_data_by_id(&self, data_id: i32) -> Result<Option<models::PluginData>> {
        let mut stmt = self.conn.prepare(
            "SELECT data_id, plugin_id, data_type, data, search_text, created_at, updated_at FROM plugin_data WHERE data_id = ?1",
        )?;
        let plugin_data_iter = stmt.query_map(params![data_id], |row| {
            Ok(models::PluginData {
                data_id: row.get(0)?,
                plugin_id: row.get(1)?,
                data_type: row.get(2)?,
                data: row.get(3)?,
                search_text: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })?;
        let mut plugin_data = Vec::new();
        for data in plugin_data_iter {
            plugin_data.push(data?);
        }
        Ok(plugin_data.first().cloned())
    }

    pub fn search_plugin_data(
        &self,
        plugin_id: i32,
        data_type: Option<&str>,
        search_text: Option<&str>,
        after_created_at: Option<&str>,
        before_created_at: Option<&str>,
    ) -> Result<Vec<models::PluginData>> {
        let mut query = String::from(
            "SELECT data_id, plugin_id, data_type, data, search_text, created_at, updated_at 
             FROM plugin_data 
             WHERE plugin_id = ?1",
        );
        let mut params: Vec<Box<dyn ToSql>> = vec![Box::new(plugin_id)];
        let mut param_index = 2;

        if let Some(dt) = data_type {
            query.push_str(&format!(" AND data_type = ?{}", param_index));
            params.push(Box::new(dt));
            param_index += 1;
        }

        if let Some(st) = search_text {
            query.push_str(&format!(" AND search_text LIKE ?{}", param_index));
            params.push(Box::new(format!("%{}%", st)));
            param_index += 1;
        }

        if let Some(after) = after_created_at {
            query.push_str(&format!(" AND created_at > ?{}", param_index));
            params.push(Box::new(after));
            param_index += 1;
        }

        if let Some(before) = before_created_at {
            query.push_str(&format!(" AND created_at < ?{}", param_index));
            params.push(Box::new(before));
        }

        let mut stmt = self.conn.prepare(&query)?;

        let plugin_data_iter =
            stmt.query_map(params_from_iter(params.iter().map(|p| p.as_ref())), |row| {
                Ok(models::PluginData {
                    data_id: row.get(0)?,
                    plugin_id: row.get(1)?,
                    data_type: row.get(2)?,
                    data: row.get(3)?,
                    search_text: row.get(4)?,
                    created_at: row.get(5)?,
                    updated_at: row.get(6)?,
                })
            })?;

        let mut plugin_data = Vec::new();
        for data in plugin_data_iter {
            plugin_data.push(data?);
        }
        Ok(plugin_data)
    }

    pub fn delete_plugin_data_by_id(&self, data_id: i32) -> Result<()> {
        self.conn.execute(
            "DELETE FROM plugin_data WHERE data_id = ?1",
            params![data_id],
        )?;
        Ok(())
    }

    pub fn update_plugin_data_by_id(
        &self,
        data_id: i32,
        data: &str,
        search_text: Option<&str>,
    ) -> Result<()> {
        self.conn.execute(
            "UPDATE plugin_data SET data = ?1, search_text = ?2 WHERE data_id = ?3",
            params![data, search_text, data_id],
        )?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{fs, path::PathBuf};
    use tempfile::tempdir;

    #[test]
    fn test_get_connection() {
        let dir = tempdir().unwrap();
        let db_path = dir.path().join("test.db");
        let _conn = get_connection(&db_path, None).unwrap();
        assert!(fs::metadata(&db_path).is_ok());
        fs::remove_file(&db_path).unwrap();
    }

    #[test]
    fn test_plugin() {
        let dir = tempdir().unwrap();
        let db_path = dir.path().join("test.db");
        // create database and initialize
        let db = JarvisDB::new(&db_path, None).unwrap();
        assert!(fs::metadata(&db_path).is_ok());
        db.init().unwrap();
        db.create_plugin("test", "0.1.0", Some("test"), Some("test"))
            .unwrap();
        let plugins = db.get_all_plugins().unwrap();
        assert_eq!(plugins.len(), 1);

        // expect error due to unique identifier constraint
        assert!(db
            .create_plugin("test", "0.1.0", Some("test"), Some("test"))
            .is_err());

        // get plugin by identifier
        let plugin = db.get_plugin_by_identifier("test").unwrap();
        assert!(plugin.is_some());
        let plugin = plugin.unwrap();
        assert_eq!(plugin.identifier, "test");
        assert_eq!(plugin.version, "0.1.0");
        assert_eq!(plugin.alias, Some("test".to_string()));
        assert_eq!(plugin.hotkey, Some("test".to_string()));
        assert_eq!(plugin.is_enabled, true);
        assert_eq!(plugin.installed_at.len(), 19);

        // get plugin by identifier that does not exist
        let plugin = db.get_plugin_by_identifier("test2").unwrap();
        assert!(plugin.is_none());

        /* ----------------------- Delete plugin by identifier ---------------------- */
        db.delete_plugin_by_identifier("test").unwrap();
        let plugins = db.get_all_plugins().unwrap();
        assert_eq!(plugins.len(), 0);

        fs::remove_file(&db_path).unwrap();
    }

    #[test]
    fn test_plugin_data_crud() {
        // let dir = tempdir().unwrap();
        // let db_path = dir.path().join("test.db");
        let db_path = PathBuf::from("./test.db");
        if db_path.exists() {
            fs::remove_file(&db_path).unwrap();
        }

        // create database and initialize
        let db = JarvisDB::new(&db_path, None).unwrap();
        assert!(fs::metadata(&db_path).is_ok());
        db.init().unwrap();
        db.create_plugin("test", "0.1.0", Some("test"), Some("test"))
            .unwrap();
        let plugin = db.get_plugin_by_identifier("test").unwrap().unwrap();

        db.create_plugin_data(plugin.plugin_id, "test", "{}", None)
            .unwrap();
        db.create_plugin_data(plugin.plugin_id, "setting", "{}", None)
            .unwrap();
        /* ---------------------- Search with data_type == test --------------------- */
        let plugin_data = db
            .search_plugin_data(plugin.plugin_id, Some("test"), None, None, None)
            .unwrap();
        assert_eq!(plugin_data.len(), 1); // there is only one record with data_type == test
                                          /* ------------------------ Search without any filter ----------------------- */
        let plugin_data = db
            .search_plugin_data(plugin.plugin_id, None, None, None, None)
            .unwrap();
        assert_eq!(plugin_data.len(), 2); // one test, one setting

        /* -------------------------- Test Full Text Search ------------------------- */
        db.create_plugin_data(
            plugin.plugin_id,
            "data",
            "{}",
            Some("hello world from rust"),
        )
        .unwrap();
        db.create_plugin_data(plugin.plugin_id, "data", "{}", Some("world is a mess"))
            .unwrap();
        /* ----------------------- both record contains world ----------------------- */
        let plugin_data = db
            .search_plugin_data(plugin.plugin_id, Some("data"), Some("wOrLd"), None, None)
            .unwrap();
        assert_eq!(plugin_data.len(), 2);
        /* ------------------------ search for rust with FTS ------------------------ */
        let plugin_data = db
            .search_plugin_data(plugin.plugin_id, Some("data"), Some("rust"), None, None)
            .unwrap();
        assert_eq!(plugin_data.len(), 1);

        // get plugin data with search text that does not exist
        let plugin_data = db
            .search_plugin_data(plugin.plugin_id, Some("test"), Some("test"), None, None)
            .unwrap();
        assert_eq!(plugin_data.len(), 0);

        /* ---------------- All 4 test records are created after 2021 --------------- */
        let plugin_data = db
            .search_plugin_data(plugin.plugin_id, None, None, Some("2021-01-01"), None)
            .unwrap();
        assert_eq!(plugin_data.len(), 4);

        // I don't think this code(or I) could live long enough to see this test fail 2100
        let plugin_data = db
            .search_plugin_data(plugin.plugin_id, None, None, Some("2100-01-01"), None)
            .unwrap();
        assert_eq!(plugin_data.len(), 0);

        /* --------------- All 4 test records are created before 2030 --------------- */
        // if this code still runs in 2030, I will be very happy to fix this test
        let plugin_data = db
            .search_plugin_data(plugin.plugin_id, None, None, None, Some("2030-01-01"))
            .unwrap();
        assert_eq!(plugin_data.len(), 4);

        // get plugin data with created_at filter that does not exist
        let plugin_data = db
            .search_plugin_data(plugin.plugin_id, None, None, None, Some("2021-01-01"))
            .unwrap();
        assert_eq!(plugin_data.len(), 0);

        /* ---------------------- Delete plugin data by data_id ---------------------- */
        // there is only one record with data_type == setting
        let plugin_data = db
            .search_plugin_data(plugin.plugin_id, Some("setting"), None, None, None)
            .unwrap();
        let data_id = plugin_data.first().unwrap().data_id;
        db.delete_plugin_data_by_id(data_id).unwrap();
        let plugin_data = db
            .search_plugin_data(plugin.plugin_id, Some("setting"), None, None, None)
            .unwrap();
        assert_eq!(plugin_data.len(), 0);

        /* ---------------------- Update plugin data by data_id ---------------------- */
        let plugin_data = db
            .search_plugin_data(plugin.plugin_id, Some("data"), None, None, None)
            .unwrap();
        let data_id = plugin_data.first().unwrap().data_id;
        db.update_plugin_data_by_id(data_id, "{\"name\": \"huakun\"}", Some("updated"))
            .unwrap();
        let plugin_data = db.get_plugin_data_by_id(data_id).unwrap();
        assert!(plugin_data.is_some());
        let plugin_data = plugin_data.unwrap();
        assert_eq!(plugin_data.data, "{\"name\": \"huakun\"}");

        fs::remove_file(&db_path).unwrap();
    }
}
