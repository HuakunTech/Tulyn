# jarvis-api

[Jarvis API](https://www.npmjs.com/package/jarvis-api) is an NPM package designed for developers to create extensions for Jarvis.

For now, only `jarvis-api/ui` is useful. This subpackage is designed for UI extension commands.

`jarvis-api/ui` exposes a set of APIs to interact with Jarvis and access system resources.

- Clipboard API: read and write clipboard
- System API: get system information
- Shell API: run shell command
- File System API: access file system
- Notification API: show notification
- Dialog API: show dialog, interact with user
- etc.

Read more details in documentation at https://docs.jarvis.huakun.tech.

## Note

This package should not have any internal dependencies (e.g. `workspace:*`). Otherwise, the package cannot be published to NPM.

## Dev

### Dependency Graph

```bash
p madge ./src/ui/worker/index.ts --circular # detect circular dependencies
pnpm dep-tree ./src/ui/worker/index.ts
```
