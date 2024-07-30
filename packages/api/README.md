# @kksh/api

[Kunkun API](https://www.npmjs.com/package/@kksh/api) is an NPM package designed for developers to create extensions for Jarvis.

`@kksh/api` provides a set of APIs for extensions to interact with Kunkun and System APIs. The APIs include:

- Clipboard API: read and write clipboard
- System API: get system information
- Shell API: run shell command
- File System API: access file system
- Notification API: show notification
- Dialog API: show dialog, interact with user
- etc.

Read more details in documentation at https://docs.kunkun.sh

## Dev

### Dependency Graph

```bash
p madge ./src/ui/worker/index.ts --circular # detect circular dependencies
pnpm dep-tree ./src/ui/worker/index.ts
```
