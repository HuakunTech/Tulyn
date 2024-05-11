---
title: Window
description: Window management in Jarvis
---

## Reference

- [Tauri Issue: Multiple webviews in one window](https://github.com/tauri-apps/tauri/issues/2975)
- [Tauri Issue: A BrowserView that can be used to embed additional web content into webview window #2709](https://github.com/tauri-apps/tauri/issues/2709)
- [Tauri PR: refactor(core): add support to multiple webviews on a Tauri window #8280](https://github.com/tauri-apps/tauri/pull/8280)
  - Tested, this works, but need to add `unstable` feature flag. https://github.com/tauri-apps/tauri/blob/bd64982fe6bc30980317609783de1b876183133c/examples/multiwebview/main.rs#L9
