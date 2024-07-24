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

KK is designed to be cross-platform, it supports Windows, macOS, and Linux.

## Extensions

### Unleash the Power of KK: Build Custom Tools with Ease

KK takes a page out of popular platforms like VSCode, Raycast, and Alfred, offering an extensible framework for you to craft your own tools. Imagine a toolbox that adapts to your needs – that's what KK empowers you with.

### JavaScript for Speedy Development

Building extensions in KK is a breeze. Each extension is a lightweight JavaScript applet, making development fast and familiar. Need a simple UI? A pre-built template lets you create it with minimal code. But don't be limited! KK supports complex interfaces built with web technologies like React, Vue, or Svelte, as long as the final output is a static website (SSG/CSR).

### Lightweight Champions

KK extensions are designed to be featherweights, typically clocking in at a mere 40-200KB (even with UI libraries). Compare that to traditional desktop apps (often in the megabyte range) or Electron apps (sometimes exceeding 100MB). For tasks like image editing, document searching, file/video convertsions, a full-blown app is overkill. KK extensions provide a streamlined solution within your existing workflow.

### Write Once, Run Everywhere

The magic of web-based extensions? Write your code once and deploy it across platforms. No more compatibility headaches! KK acts as the launchpad for your creations, letting you share them with the community without worrying about native code complexities, distribution hassles, or code signing nightmares.

### Performance Under Control

KK is built for efficiency. It loads extensions on-demand, ensuring smooth performance even if you have 1000+ extensions installed.

### Open Source and Community-Driven

Transparency and collaboration are core values for KK. All extensions are open-source and readily available on GitHub at [**KunkunExtensions**](https://github.com/HuakunTech/kunkunExtensions). This lets the community contribute, review code, and ensure quality.

### Explore the Extension Store

KK comes with a dedicated extension store like Apple's app store where you can discover and download tools created by the community. While I personally review submissions before adding them to the repository, the focus remains on openness and public scrutiny. This way, you have complete control over what you install.

### Beyond the Store

KK offers ultimate flexibility. You're not restricted to the store. Install extensions directly from sources like Github, npm, or even a simple tarball file. But remember, with great power comes great responsibility. Always ensure the source is trustworthy before installing an extension.

### Empower Yourself with KK

With its open-source nature, on-demand loading, and lightweight design, KK grants you the freedom to build and customize your workflow exactly the way you want it. Start exploring the possibilities today!

## Permissions

KK prioritizes security, but understands the need for powerful tools. Here's how we navigate this balance:

### Permissions for Functionality

Some extensions require access to specific resources to function effectively. For instance, a file search extension needs to scan your file system, while a clipboard manager relies on clipboard access. Without these permissions, extensions would have limited capabilities.

### Transparency is Key

Similar to Chrome extensions, KK implements a permission system. Developers must explicitly declare required permissions, which you'll see clearly before installing. This allows informed decisions about the data your extensions access.

### Security Measures in Place

Access to unauthorized APIs is strictly blocked and logged by KK. This ensures your data stays protected, even if an extension malfunctions.

### Ready to Build?

Head over to the documentation or reach out to me or our Discord community for guidance. Once you've crafted your masterpiece, submit a Pull Request (PR) to the [**KunkunExtensions**](https://github.com/HuakunTech/kunkunExtensions) repository.

