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

#[derive(Debug)]
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
    /*                               Extensions CRUD                              */
    /* -------------------------------------------------------------------------- */

    pub fn create_extension(
        &self,
        identifier: &str,
        version: &str,
        alias: Option<&str>,
        hotkey: Option<&str>,
    ) -> Result<()> {
        self.conn.execute(
            "INSERT INTO extensions (identifier, version, alias, hotkey) VALUES (?1, ?2, ?3, ?4)",
            params![identifier, version, alias, hotkey],
        )?;
        Ok(())
    }

    pub fn get_all_extensions(&self) -> Result<Vec<models::Ext>> {
        let mut stmt = self.conn.prepare(
            "SELECT ext_id, identifier, version, alias, hotkey, is_enabled, installed_at FROM extensions",
        )?;
        let ext_iter = stmt.query_map(params![], |row| {
            Ok(models::Ext {
                ext_id: row.get(0)?,
                identifier: row.get(1)?,
                version: row.get(2)?,
                alias: row.get(3)?,
                hotkey: row.get(4)?,
                is_enabled: row.get(5)?,
                installed_at: row.get(6)?,
            })
        })?;
        let mut exts = Vec::new();
        for ext in ext_iter {
            exts.push(ext?);
        }
        Ok(exts)
    }

    pub fn get_extension_by_identifier(&self, identifier: &str) -> Result<Option<models::Ext>> {
        let mut stmt = self.conn.prepare(
            "SELECT ext_id, identifier, version, alias, hotkey, is_enabled, installed_at FROM extensions WHERE identifier = ?1",
        )?;
        let ext_iter = stmt.query_map(params![identifier], |row| {
            Ok(models::Ext {
                ext_id: row.get(0)?,
                identifier: row.get(1)?,
                version: row.get(2)?,
                alias: row.get(3)?,
                hotkey: row.get(4)?,
                is_enabled: row.get(5)?,
                installed_at: row.get(6)?,
            })
        })?;
        let mut exts = Vec::new();
        for ext in ext_iter {
            exts.push(ext?);
        }
        Ok(exts.first().cloned())
    }

    pub fn delete_extension_by_identifier(&self, identifier: &str) -> Result<()> {
        self.conn.execute(
            "DELETE FROM extensions WHERE identifier = ?1",
            params![identifier],
        )?;
        Ok(())
    }

    /* -------------------------------------------------------------------------- */
    /*                            Extension Data CRUD                            */
    /* -------------------------------------------------------------------------- */
    pub fn create_extension_data(
        &self,
        ext_id: i32,
        data_type: &str,
        data: &str,
        search_text: Option<&str>,
    ) -> Result<()> {
        self.conn.execute(
            "INSERT INTO extension_data (ext_id, data_type, data, search_text) VALUES (?1, ?2, ?3, ?4)",
            params![ext_id, data_type, data, search_text],
        )?;
        Ok(())
    }

    pub fn get_extension_data_by_id(&self, data_id: i32) -> Result<Option<models::ExtData>> {
        let mut stmt = self.conn.prepare(
            "SELECT data_id, ext_id, data_type, data, search_text, created_at, updated_at FROM extension_data WHERE data_id = ?1",
        )?;
        let ext_data_iter = stmt.query_map(params![data_id], |row| {
            Ok(models::ExtData {
                data_id: row.get(0)?,
                ext_id: row.get(1)?,
                data_type: row.get(2)?,
                data: row.get(3)?,
                search_text: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })?;
        let mut ext_data = Vec::new();
        for data in ext_data_iter {
            ext_data.push(data?);
        }
        Ok(ext_data.first().cloned())
    }

    pub fn search_extension_data(
        &self,
        ext_id: i32,
        data_type: Option<&str>,
        search_text: Option<&str>,
        after_created_at: Option<&str>,
        before_created_at: Option<&str>,
    ) -> Result<Vec<models::ExtData>> {
        let mut query = String::from(
            "SELECT data_id, ext_id, data_type, data, search_text, created_at, updated_at 
             FROM extension_data 
             WHERE ext_id = ?1",
        );
        let mut params: Vec<Box<dyn ToSql>> = vec![Box::new(ext_id)];
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

        let ext_data_iter =
            stmt.query_map(params_from_iter(params.iter().map(|p| p.as_ref())), |row| {
                Ok(models::ExtData {
                    data_id: row.get(0)?,
                    ext_id: row.get(1)?,
                    data_type: row.get(2)?,
                    data: row.get(3)?,
                    search_text: row.get(4)?,
                    created_at: row.get(5)?,
                    updated_at: row.get(6)?,
                })
            })?;

        let mut ext_data = Vec::new();
        for data in ext_data_iter {
            ext_data.push(data?);
        }
        Ok(ext_data)
    }

    pub fn delete_extension_data_by_id(&self, data_id: i32) -> Result<()> {
        self.conn.execute(
            "DELETE FROM extension_data WHERE data_id = ?1",
            params![data_id],
        )?;
        Ok(())
    }

    pub fn update_extension_data_by_id(
        &self,
        data_id: i32,
        data: &str,
        search_text: Option<&str>,
    ) -> Result<()> {
        self.conn.execute(
            "UPDATE extension_data SET data = ?1, search_text = ?2 WHERE data_id = ?3",
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
    fn test_extension_crud() {
        let dir = tempdir().unwrap();
        let db_path = dir.path().join("test.db");
        // create database and initialize
        let db = JarvisDB::new(&db_path, None).unwrap();
        assert!(fs::metadata(&db_path).is_ok());
        db.init().unwrap();
        db.create_extension("test", "0.1.0", Some("test"), Some("test"))
            .unwrap();
        let exts = db.get_all_extensions().unwrap();
        assert_eq!(exts.len(), 1);

        // expect error due to unique identifier constraint
        assert!(db
            .create_extension("test", "0.1.0", Some("test"), Some("test"))
            .is_err());

        // get ext by identifier
        let ext = db.get_extension_by_identifier("test").unwrap();
        assert!(ext.is_some());
        let ext = ext.unwrap();
        assert_eq!(ext.identifier, "test");
        assert_eq!(ext.version, "0.1.0");
        assert_eq!(ext.alias, Some("test".to_string()));
        assert_eq!(ext.hotkey, Some("test".to_string()));
        assert_eq!(ext.is_enabled, true);
        assert_eq!(ext.installed_at.len(), 19);

        // get ext by identifier that does not exist
        let ext = db.get_extension_by_identifier("test2").unwrap();
        assert!(ext.is_none());

        /* ----------------------- Delete ext by identifier ---------------------- */
        db.delete_extension_by_identifier("test").unwrap();
        let exts = db.get_all_extensions().unwrap();
        assert_eq!(exts.len(), 0);

        fs::remove_file(&db_path).unwrap();
    }

    #[test]
    fn test_ext_data_crud() {
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
        db.create_extension("test", "0.1.0", Some("test"), Some("test"))
            .unwrap();
        let ext = db.get_extension_by_identifier("test").unwrap().unwrap();

        db.create_extension_data(ext.ext_id, "test", "{}", None)
            .unwrap();
        db.create_extension_data(ext.ext_id, "setting", "{}", None)
            .unwrap();
        /* ---------------------- Search with data_type == test --------------------- */
        let ext_data = db
            .search_extension_data(ext.ext_id, Some("test"), None, None, None)
            .unwrap();
        assert_eq!(ext_data.len(), 1); // there is only one record with data_type == test

        /* ------------------------ Search without any filter ----------------------- */
        let ext_data = db
            .search_extension_data(ext.ext_id, None, None, None, None)
            .unwrap();
        assert_eq!(ext_data.len(), 2); // one test, one setting

        /* -------------------------- Test Full Text Search ------------------------- */
        db.create_extension_data(ext.ext_id, "data", "{}", Some("hello world from rust"))
            .unwrap();
        db.create_extension_data(ext.ext_id, "data", "{}", Some("world is a mess"))
            .unwrap();
        /* ----------------------- both record contains world ----------------------- */
        let ext_data = db
            .search_extension_data(ext.ext_id, Some("data"), Some("wOrLd"), None, None)
            .unwrap();
        assert_eq!(ext_data.len(), 2);
        /* ------------------------ search for rust with FTS ------------------------ */
        let ext_data = db
            .search_extension_data(ext.ext_id, Some("data"), Some("rust"), None, None)
            .unwrap();
        assert_eq!(ext_data.len(), 1);

        // get ext data with search text that does not exist
        let ext_data = db
            .search_extension_data(ext.ext_id, Some("test"), Some("test"), None, None)
            .unwrap();
        assert_eq!(ext_data.len(), 0);

        /* ---------------- All 4 test records are created after 2021 --------------- */
        let ext_data = db
            .search_extension_data(ext.ext_id, None, None, Some("2021-01-01"), None)
            .unwrap();
        assert_eq!(ext_data.len(), 4);

        // I don't think this code(or I) could live long enough to see this test fail 2100
        let ext_data = db
            .search_extension_data(ext.ext_id, None, None, Some("2100-01-01"), None)
            .unwrap();
        assert_eq!(ext_data.len(), 0);

        /* --------------- All 4 test records are created before 2030 --------------- */
        // if this code still runs in 2030, I will be very happy to fix this test
        let ext_data = db
            .search_extension_data(ext.ext_id, None, None, None, Some("2030-01-01"))
            .unwrap();
        assert_eq!(ext_data.len(), 4);

        // get ext data with created_at filter that does not exist
        let ext_data = db
            .search_extension_data(ext.ext_id, None, None, None, Some("2021-01-01"))
            .unwrap();
        assert_eq!(ext_data.len(), 0);

        /* ---------------------- Delete ext data by data_id ---------------------- */
        // there is only one record with data_type == setting
        let ext_data = db
            .search_extension_data(ext.ext_id, Some("setting"), None, None, None)
            .unwrap();
        let data_id = ext_data.first().unwrap().data_id;
        db.delete_extension_data_by_id(data_id).unwrap();
        let ext_data = db
            .search_extension_data(ext.ext_id, Some("setting"), None, None, None)
            .unwrap();
        assert_eq!(ext_data.len(), 0);

        /* ---------------------- Update ext data by data_id ---------------------- */
        let ext_data = db
            .search_extension_data(ext.ext_id, Some("data"), None, None, None)
            .unwrap();
        let data_id = ext_data.first().unwrap().data_id;
        db.update_extension_data_by_id(data_id, "{\"name\": \"huakun\"}", Some("updated"))
            .unwrap();
        let ext_data = db.get_extension_data_by_id(data_id).unwrap();
        assert!(ext_data.is_some());
        let ext_data = ext_data.unwrap();
        assert_eq!(ext_data.data, "{\"name\": \"huakun\"}");

        fs::remove_file(&db_path).unwrap();
    }
}
