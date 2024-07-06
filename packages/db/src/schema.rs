pub const SCHEMA: &str = r#"
    -- Extensions table
    CREATE TABLE IF NOT EXISTS extensions (
        ext_id INTEGER PRIMARY KEY AUTOINCREMENT,
        identifier TEXT UNIQUE NOT NULL,
        version TEXT NOT NULL,
        alias TEXT,
        hotkey TEXT,
        is_enabled BOOLEAN DEFAULT TRUE,
        installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Extension Data table
    CREATE TABLE IF NOT EXISTS extension_data (
        data_id INTEGER PRIMARY KEY AUTOINCREMENT,
        ext_id INTEGER NOT NULL,
        data_type TEXT NOT NULL,
        data JSON NOT NULL,
        search_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ext_id) REFERENCES extensions(ext_id)
    );

    -- Full-text search index for ext_data
    CREATE VIRTUAL TABLE IF NOT EXISTS extension_data_fts USING fts5(
        data_id UNINDEXED,
        search_text,
        content=extension_data,
        content_rowid=data_id
    );

    -- Trigger to update FTS index when extension_data is inserted
    CREATE TRIGGER IF NOT EXISTS extension_data_ai AFTER INSERT ON extension_data BEGIN
        INSERT INTO extension_data_fts(data_id, search_text) VALUES (new.data_id, new.search_text);
    END;

    -- Trigger to update FTS index when extension_data is updated
    CREATE TRIGGER IF NOT EXISTS extension_data_au AFTER UPDATE ON extension_data BEGIN
        INSERT INTO extension_data_fts(extension_data_fts, data_id, search_text) VALUES('delete', old.data_id, old.search_text);
        INSERT INTO extension_data_fts(data_id, search_text) VALUES (new.data_id, new.search_text);
    END;

    -- Trigger to update FTS index when extension_data is deleted
    CREATE TRIGGER IF NOT EXISTS extension_data_ad AFTER DELETE ON extension_data BEGIN
        INSERT INTO extension_data_fts(extension_data_fts, data_id, search_text) VALUES('delete', old.data_id, old.search_text);
    END;

    -- Trigger to update 'updated_at' timestamp when extension data is updated
    CREATE TRIGGER IF NOT EXISTS update_extension_data_timestamp AFTER UPDATE ON extension_data
    BEGIN
        UPDATE extension_data SET updated_at = CURRENT_TIMESTAMP WHERE data_id = NEW.data_id;
    END;
"#;
