---
title: Database Design
description: Database Design
---

## Requirements

This is a productivity desktop app that supports plugins.

- Each extension have access to storage.
- Storage is based on sqlite.
- Each extension should only have access to data they own.
- Each extension can have multiple commands, commands within a extension can share data.
- They may produce data of any shape, so maybe json is required. The table for extension data should be generic.
- There should be a field for data search (e.g. full text search).
- Filter by creation data and modified date is also required.
- Each extension may have multiple types of data. e.g. a clipboard manager extension can store settings and clipboard data.
- Later sqlite sync will also be implemented.
- Extension commands can have alias, hotkey, can be enabled/disabled.
- Add index to necessary fields.
- Extension can have multiple types of command
  1. iframe mode: renders web page served from local disk with a web server. Each command has a URL. need to store the URL
  2. worker mode: need to store the worker script
  3. quick link: a quick link has name, Link, app to open with, icon. May be store as json in a single field.
