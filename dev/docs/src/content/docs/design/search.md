---
title: Search
description: Search Engine
---

## Command/App Search

Search based on the following:

- Name
- Type
- Description
- Keywords
  - Keywords can be plain text (require exact match, `vs` is a match for `vsc` but `vscc` is not) or regex
  - Keywords for apps can be generated on the fly
    - With first letter of each word and split by space or hyphen or underscore
    - e.g. Visual Studio Code: `['vsc', 'visual', 'studio', 'code']`

## File Search

- Search depth need to be customizable
- respect `.gitignore`
- Consider indexing FS
- `mdfind` on mac can be used
  - ```bash
    mdfind -onlyin </path/to/search> -name <search term>
    ```
