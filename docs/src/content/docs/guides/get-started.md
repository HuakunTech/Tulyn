---
title: Get Started
description: Get started with Kunkun
sidebar:
  order: 0
---

**KK** is an open source cross-platform extensible app launcher that aims to be an alternative to Alfred and Raycast. This guide will help you get started with KK both as a user and a developer.

## Installation

For now, go to GitHub Release page to download the latest version of KK. https://github.com/HuakunTech/kunkun/releases

In the future, KK will be published to package managers and a website will also be provided.

## Supported Platforms

KK is designed to be cross-platform. It not only supports Windows and MacOS, but also Linux.

Linux is usually ignored by software companies and app developers as it has a small market share. 

However, as a developer myself, I admire the open source spirit of Linux and I want to make KK available to Linux users.

## Extensions

### Unleash the Power of KK: Build Custom Tools with Ease

KK takes a page out of popular platforms like VSCode, Raycast, and Alfred, offering an extensible framework for you to craft your own tools. Imagine a toolbox that adapts to your needs – that's what KK empowers you with.

### JavaScript for Speedy Development

Building extensions in KK is a breeze. Each extension is a lightweight JavaScript applet, making development fast and familiar. Need a simple UI? A pre-built template lets you create it with minimal code. But don't be limited! KK supports complex interfaces built with web technologies like React, Vue, or Svelte, as long as the final output is a static website (SSG/CSR).

### Lightweight

KK extensions are designed to be featherweights, typically clocking in at a mere 30-200KB (even with UI libraries). Compare that to traditional desktop apps (often in the megabyte range) or Electron apps (usually exceeding 100MB). For simple tasks like document searching, file/video conversions, a full-blown app is overkill. KK extensions provide a streamlined solution within your existing workflow.

### Write Once, Run Everywhere

The magic of web-based extensions? Write your code once and deploy it across platforms. No more compatibility headaches! KK acts as the launchpad for your creations, letting you share them with the community without worrying about native code complexities, distribution hassles, or code signing nightmares.

### Open Source and Community-Driven

All extensions source code are readily available on GitHub at [**KunkunExtensions**](https://github.com/HuakunTech/kunkunExtensions). This lets the community contribute, review code, and ensure quality.

### Explore the Extension Store

KK comes with a dedicated extension store like Apple's app store where you can discover and download tools created by the community. While I personally review submissions before adding them to the repository, the focus remains on openness and public scrutiny. This way, you have complete control over what you install.

### Beyond the Store

KK offers ultimate flexibility. You're not restricted to the store. Install extensions directly from sources like Github, npm, or even a simple tarball file. But always ensure the source is trustworthy before installing an extension.

## Permissions

KK prioritizes security, but understands the need for powerful tools. Here's how we navigate this balance:

### Permissions for Functionality

Some extensions require access to specific resources to function effectively. For instance, a file search extension needs to scan your file system, while a clipboard manager relies on clipboard access. Without these permissions, extensions would have limited capabilities.

### Transparency is Key

Similar to Chrome extensions, KK implements a permission system. Developers must explicitly declare required permissions, which you'll see clearly before installing. This allows informed decisions about the data your extensions access.

### Security Measures in Place

Access to unauthorized APIs is strictly blocked and logged by KK. This ensures your data stays protected, even if an extension malfunctions.

### Ready to Build?

Head over to the [documentation](/extensions/write-extension/) or reach out to me on Discord. Once you've crafted your masterpiece, submit a Pull Request (PR) to the [**KunkunExtensions**](https://github.com/HuakunTech/kunkunExtensions) repository.

