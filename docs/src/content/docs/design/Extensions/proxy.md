---
title: Extension Proxy
description: A guide in my new Starlight docs site.
---

# Extension Proxy

Each extension has a package name. When stored on disk, they have a uuid folder name.

When extensions are loaded. Jarvis read the package.json for package name and map it with folder name.

Extensions URL are loaded with url: `http://localhost:1566/extensions/{extension name}/<route>`

## Reverse Proxy

Jarvis also provides a reverse proxy to translate to URL to find the file on disk.

This prevents one extension from accessing another extension's files.

Get the folder name from the package name.

Translate the url to `/extensions/{folder name}/<route>`.

Base URL for extensions must be configured.`baseUrl = /extensions/{extension name}`. Otherwise page routing within single page application will route to the wrong page. For example `/about` will route to `/about` rather than `/extensions/{extension name}/about`.

## Is there other way to prevent one extension from loading page of another extension?

When an extension is active, store the extension name in state. Every time a request is sent to proxy server, check if the requested page belongs to the active extension.

## Allow Extension to Access Other Extension may be a good feature

Similar to deep link. Browser can open web page in another native phone app for better experience.

Suppose I have a job 1 in ext 1. When job 1 is processed, ext 1 can suggest to open ext 2 to view the result or further process the result. Just use a get request with query parameters to transfer the data.

However, this could be dangerous. If ext 2 does some sensitive operation, it could be triggered by ext 1.

This shouldn't be allowed. Extension isolation is still more important.

## Tauri Custom URI Scheme

Tauri provides a way to register custom URI scheme. This could useful for loading extension pages without an http server.

Doc: https://docs.rs/tauri/1.6.5/tauri/struct.Builder.html#method.register_uri_scheme_protocol
