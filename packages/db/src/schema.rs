pub const SCHEMA: &str = r#"
    -- Plugins table
    CREATE TABLE IF NOT EXISTS plugins (
        plugin_id INTEGER PRIMARY KEY AUTOINCREMENT,
        identifier TEXT UNIQUE NOT NULL,
        version TEXT NOT NULL,
        alias TEXT,
        hotkey TEXT,
        is_enabled BOOLEAN DEFAULT TRUE,
        installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Plugin Data table
    CREATE TABLE IF NOT EXISTS plugin_data (
        data_id INTEGER PRIMARY KEY AUTOINCREMENT,
        plugin_id INTEGER NOT NULL,
        data_type TEXT NOT NULL,
        data JSON NOT NULL,
        search_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plugin_id) REFERENCES plugins(plugin_id)
    );

    -- Full-text search index for plugin_data
    CREATE VIRTUAL TABLE IF NOT EXISTS plugin_data_fts USING fts5(
        data_id UNINDEXED,
        search_text,
        content=plugin_data,
        content_rowid=data_id
    );

    -- Trigger to update FTS index when plugin_data is inserted
    CREATE TRIGGER IF NOT EXISTS plugin_data_ai AFTER INSERT ON plugin_data BEGIN
        INSERT INTO plugin_data_fts(data_id, search_text) VALUES (new.data_id, new.search_text);
    END;

    -- Trigger to update FTS index when plugin_data is updated
    CREATE TRIGGER IF NOT EXISTS plugin_data_au AFTER UPDATE ON plugin_data BEGIN
        INSERT INTO plugin_data_fts(plugin_data_fts, data_id, search_text) VALUES('delete', old.data_id, old.search_text);
        INSERT INTO plugin_data_fts(data_id, search_text) VALUES (new.data_id, new.search_text);
    END;

    -- Trigger to update FTS index when plugin_data is deleted
    CREATE TRIGGER IF NOT EXISTS plugin_data_ad AFTER DELETE ON plugin_data BEGIN
        INSERT INTO plugin_data_fts(plugin_data_fts, data_id, search_text) VALUES('delete', old.data_id, old.search_text);
    END;

    -- Trigger to update 'updated_at' timestamp when plugin data is updated
    CREATE TRIGGER IF NOT EXISTS update_plugin_data_timestamp AFTER UPDATE ON plugin_data
    BEGIN
        UPDATE plugin_data SET updated_at = CURRENT_TIMESTAMP WHERE data_id = NEW.data_id;
    END;
"#;
