---
title: Sample Manifest (`package.json`)
description: A guide in my new Starlight docs site.
---

## Sample Manifest (`package.json`)

```json
{
  "name": "some-extensions",
  "version": "1.0.0",
  "description": "An extension for Jarvis",
  "jarvis": {
    "identifier": "video-processing.huakun.tech",
    "ui": "dist",
    "platforms": ["linux", "darwin", "win32"]
  }
}
```

## Development Mode

To develop an extension with live reload, Jarvis can load your extension pages with an url.

For example, set `ui` to `http://localhost:3000` in `package.json`.

```json
{
  "name": "some-extensions",
  "version": "1.0.0",
  "description": "An extension for Jarvis",
  "jarvis": {
    "identifier": "video-processing.huakun.tech",
    "ui": "http://localhost:3000",
    "platforms": ["linux", "darwin", "win32"]
  }
}
```
