---
title: Draft
description: Draft
---

How to run extension JavaScript code with `bun` or `node`? Sometimes extension can be simple and don't need a UI.

For example, a extension that runs file filter to find a file and open it with a specific editor.

## Option 1: Run with `bun`

Include `bun` as a sidecar.

In a extension, let's say keyword `code` should trigger a file filter, find the file and open it with a specific editor.

### Q1: How to trigger the function associated with keyword `code`?

Jarvis runs a `bun` process, load the extension with `const lib = await import(libpath);` and call the function associated with keyword `code`. Lifecycle functions are called automatically.

### How to execute file filter from extension?

Developer can write their own file filter function to scan the file system.

What if Jarvis API provides a file filter function and some other common functions?

Then this has to be some kind of Jarvis API library extension developer can import.

To the lowest level, extension will have to communicate with Jarvis core process to get any data. How to IPC?

- Use a server to communicate with Jarvis core process and any extension can communicate with the server to get data and control the UI or the app.

Procedures

1. When extension loads, register the command keywords like `code` or any other regex
   1. Map the keyword to extension so we know which extension to call when the keyword is triggered
2. When keyword triggered, run a bun process from Jarvis core process (rust), and map the pid with active extension. If anything go wrong, such as the process exceeds time limit or memory limit, kill the process.

   ```bash
   # run this command from Jarvis core process in Rust
   bun run /path/to/extension/lib/index.ts
   ```

API-Driven Design: write sample client code first

```ts title="extension/lib/index.js"
import { ExtensionTemplate, FileFilter, open, setListView } from "@akun/api"

function customFindFile(filename: string, scope: string, depth: number = 5) {
  // ...
}

class OpenEditorExt extends ExtensionTemplate {
  constructor() {
    super()
  }

  async onPluginCalled(data) {
    const { code, type, payload } = data
    // payload is the query. For example `code {filename query}`
    const file = await FileFilter.findFile(payload, scope)
    // send request to server, server will find related files, list them, when user select a file from list view, server will send the file path to the client

    // Or if developer choose to use custom file filter
    const paths = customFindFile(payload, scope, 5)
    // send a request to server to update the list view with the paths
    setListView(paths)
    // client will open the file with a specific editor
    open(file, "code") // send another request to server to open the file with a specific app
  }
}

const ext = OpenEditorExt()
ext.start() //
```

## Option 2: Provide a Extension Runtime

The runtime is a bun process that import extensions code as library and run it.

In Jarvis runtime, run with bun

```ts
// connect to server, e.g. socketio or bidirectinal grpc stream
runtime.connect("http://localhost:1566")
runtime.getExtensionInfo() // get extension info from server, such as command keywords, etc.

// it's possible to include this code in jarvis-api and let extension run this client to connect with server
// but if there are many extensions, the client code will be duplicated in each extension (e.g. socketio client lib duplicated many times)
runtime.on("user-input", (data) => {
  const userInput: string = data
  const { command, query } = userInput // in real code, split the command and query, command is the first word (trigger word), query is the rest
  const ext = runtime.findExtension(command) // find the extension that has the command
  const lib = await import(ext.libpath)
  lib.onPluginCalled(query)
})
```
