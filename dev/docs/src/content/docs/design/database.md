---
title: Database Design
description: Database Design
---

## Requirements

This is a productivity desktop app that supports plugins.
- Each plugin have access to storage.
- Storage is based on sqlite. 
- Each plugin should only have access to data they own.
- They may produce data of any shape, so maybe json is required. The table for plugin data should be generic.
- There should be a field for data search (e.g. full text search). 
- Filter by creation data and modified date is also required.
- Each plugin may have multiple types of data. e.g. a clipboard manager plugin can store settings and clipboard data.
- Later sqlite sync will also be implemented.
- Plugin can have alias, hotkey, can be enabled/disabled.
- Add index to necessary fields.