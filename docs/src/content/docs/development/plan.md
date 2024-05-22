---
title: Dev Plan
description: Jarvis Development Plan
---

## Stage 1

- [ ] Apps launcher search bar
  - [ ] The most basic feature of an app launcher app
- [ ] Migrate server in desktop to CLI crate and import it from CLI
  - CLI could be named to something else. Being able to start and debug server separately could be useful when debugging.
  - Or extract to another common crate for both desktop and CLI, or even a separate crate for server
  - But the server should be able to make calls Tauri commands. Think carefully before migrate, it may be impossible.
  - Channels may be useful here. When Tauri create server, pass a rx channel to the server, and the server can send messages to the channel to call Tauri commands.
- [ ] Design and implement a gRPC server embedded in the desktop app
  - It should be able to control Tauri API commands
- [ ] Extract bun runtime
  - Bun is current ~51MB on mac, and 93MB on Linux, comparing to deno and nodejs (~100MB) (The size is really platform-specific). Bun is also a package manager and wasm runtime. The only thing we need is the JS/TS runtime, Try to extract it and see how small it can be. Start by looking at the CLI entrypoint and remove the package manager part.
- [ ] Implement `@jarvis/api` in TypeScript
  - `@jarvis/api/ui` is for UI extensions that runs in Tauri. The APIs calls Tauri commands
  - `@jarvis/api` is for library extensions. e.g. List View Builder (return a `ListView` to extension runtime that can be translated to json), etc.
- [ ] Implement `@jarvis/rt` in TypeScript
  - `@jarvis/rt` is the runtime for Jarvis extensions, run with bun. The runtime process will communicate with the extension server, call extension functions and control the UI.
- [ ] Implement installation system for extensions
  - From remote urls
  - From local folder
  - Dev server mode should be supported
  - Extension validator should be implemented
- [ ] Search Engine
  - Implement a robust searching engine for Jarvis to find commands and extensions
  - Implement a global file searcher
  - Calculator for simple math and currency/unit conversion 
    - e.g. [smartcalc](https://github.com/ParthJadhav/smartcalc) GPL2
    - e.g. https://github.com/ParthJadhav/verve AGPL3

## Stage 2

- [ ] Implement Alfred style GUI workflow editor to allow non-developers to create workflows
