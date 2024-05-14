---
title: Installation
description: Installation of Extensions
---

- [Goal](#goal)
- [Methods](#methods)
  - [Extension Store](#extension-store)
  - [Remote Tarball URL](#remote-tarball-url)
  - [NPM](#npm)
  - [Manual](#manual)
    - [Development Mode (Live Reload)](#development-mode-live-reload)
- [Multi-Platform](#multi-platform)

## Goal

The goal is to make it easy to install extensions in Jarvis

- Not only easy for developers but also for regular users
- Make is easy for developers to test their extensions locally

## Methods

Multiple methods are available to install extensions in Jarvis.

### Extension Store

An extension store is provided just like Raycast's Store https://www.raycast.com/store.

Alfred has a Alfred Gallery https://alfred.app/ where users can download workflows.

uTools and Rubick have built-in store like Apple's app store. uTools displays the number of downloads, rating, package size, review and more.

The ultimate goal is to have a store like uTools.

### Remote Tarball URL

Provide a URL to the tarball `.tgz` file of the extension. It can be hosted on any server, such as asset in a GitHub release, or NPM package.

- e.g. https://registry.npmjs.org/nest-neo4j/-/nest-neo4j-0.3.1.tgz

> TODO: Add real extension example here when I get one ready

### NPM

NPM is one of the most successful package manager in the world. It is used by millions of developers to share their code.

It makes sense to use it to share Jarvis extensions.

However, I don't want to use `npm` command to install extensions, as that will requires end users to have `npm` installed on their system, or Jarvis to have a `npm` binary embedded. Moreover, this will download the development dependencies of the extension.

NPM's API `https://registry.npmjs.org/{package-name}/{version}` provides a link to the tarball `.tgz` file of the package. This is what we will use to download the extension. We can set `version` to latest to get the latest version of the package.

So user can enter the follwing info to Jarvis to let Jarvis download and install automatically

- `npm` url of the package
  - e.g. without version (default to use latest) https://www.npmjs.com/package/nest-neo4j
  - e.g. with version https://www.npmjs.com/package/nest-neo4j/v/0.3.1
- NPM API URL
  - e.g. https://registry.npmjs.org/nest-neo4j/latest
  - e.g. https://registry.npmjs.org/nest-neo4j/0.3.1
- `npm` package name and version (version will default to `latest` if not provided)

> TODO: Use a real extension example here rather than `nest-neo4j`

### Manual

The simplest way to install an extension is to download the extension and place it in the `extensions` directory of Jarvis.

Jarvis provides tool to validate the extension and will load it automatically.

This could be used for local development. Developers can package their extension and load it to Jarvis by providing a path to project or place in the `extensions` directory. (When placed in `extensions` directory, Jarvis will display it as a production extension and not list it under development extensions)

#### Development Mode (Live Reload)

In `package.json`, provide the `jarvis.development.ui` field with the URL of the development server (e.g. `http://localhost:3000`). Load the project as a development extension, Jarvis will load the extension UI from the URL.

## Multi-Platform

Jarvis allows extensions to include binaries to enable higher performance or native features.

However, to support multiple platforms and CPU architectures, the extension must provide binaries for each platform, which could result in a large package size.

To solve this, Jarvis extension store will provide a way to publish platform-specific packages. Jarvis will download the package based on the platform it is running on.

For example, the request could have this format

```json
{
  "name": "demo",
  "version": "1.0.0",
  "description": "Demo Extension",
  "author": "Jarvis",
  "dist": {
    "linux": {
      "x86_64": "https://jarvis.com/demo-linux-x86_64.tgz",
      "arm64": "https://jarvis.com/demo-linux-arm64.tgz"
    },
    "darwin": {
      "x86_64": "https://jarvis.com/demo-darwin-x86_64.tgz",
      "arm64": "https://jarvis.com/demo-darwin-arm64.tgz"
    },
    "win32": {
      "x86_64": "https://jarvis.com/demo-win32-x86_64.tgz",
      "arm64": "https://jarvis.com/demo-win32-arm64.tgz"
    }
  }
}
```

If `dist` is a single URL, Jarvis assumes there is no platform-specific code in the extension.
