---
title: Get Started
description: Get started with Jarvis
---

Jarvis is an open source cross-platform extensible app launcher that aims to be an alternative to Alfred and Raycast. This guide will help you get started with Jarvis both as a user and a developer.

## Installation

For now, go to GitHub Release page to download the latest version of Jarvis. https://github.com/HuakunTech/Jarvis/releases

In the future, I will publish Jarvis to package managers and also provide a website.

## Supported Platforms

Jarvis is designed to be cross-platform. It will work on Windows, macOS, and Linux. However, community maintained plugins may not work on all platforms. Some features may also be platform-specific.

At the time of writing, Jarvis only supports macOS. Windows and Linux support will soon be added. (I still need to work on some platform-specific APIs).

## Extensions

Jarvis is designed to be extensible like VSCode, Raycast, and Alfred. You can write your own plugins to extend Jarvis's functionality, making it highly customizable. Each extension is a lightweight applet written in JavaScript using web technologies, which can be developed with virtually any framework (React, Vue, Svelte) as long as it can be generated as a static website. This allows for complex UI designs without any restrictions.

Extensions are designed to be lightweight, often as small as a few kilobytes (typically ~200KB if UI libraries used), which is significantly smaller compared to traditional desktop apps. Native apps are usually at least a few MB, and Electron apps can be over 100MB. For simple tasks such as image transformation, document search, or encoding/decoding, a full-blown app is unnecessary; a small extension running within Jarvis suffices. Further more, since extensions are web-based, they can be easily run on any platform.

Jarvis loads extensions on-demand, ensuring that performance remains unaffected even if 1000 extensions are installed. All extensions are open-source and available on GitHub at [JarvisExtensions](https://github.com/HuakunTech/JarvisExtensions) for public contributions and review.

Extensions may be provided by the community. They will be reviewed by myself before being added to the [JarvisExtensions](https://github.com/HuakunTech/JarvisExtensions) repository, but I cannot guarantee the quality and safety of these extensions. However, they remain public for transparency and scrutiny.

In the future, an extension store will be available. For now, you can install extensions using developer features under settings by providing a `.tgz` tarball file. Read more about installation [here](./installation.md).

## Permissions

There is a tradeoff between **security** and **functionality** in Jarvis extensions. Some extensions may require permissions to access your file system and system APIs to function properly. For example, a file search extension needs access to your file system to search for files, and a clipboard manager requires access to your clipboard. Without these permissions, the extensions will have limited capabilities and potentials.

Currently, Jarvis does not have a permission system, meaning all extensions have the same level of access to your system (exposed by Jarvis). This is the same for Raycast and Alfred.

In the future, I plan to implement a simple permission system similar to Chrome extensions. Extensions will need to explicitly declare the permissions they require, and users will be able to see these permissions before installing the extension. Undeclared permissions will be blocked by Jarvis.

For now, please be mindful of the extensions you install and review their code to ensure your security.

Currently the extension API is still in development, and I will provide more information on how to write extensions in the future. If you are interested in writing an extension, please read the documentation or contact me or Discord. Send a PR to [JarvisExtensions](https://github.com/HuakunTech/JarvisExtensions).
