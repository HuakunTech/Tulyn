# Actions

## Open File

- Input
  - File path (default: passed in file)
  - Default Application

## Launch Apps

- Input
  - list of apps

## Reveal File In Finder

Open parent folder of passed in file path

- Input
  - File path (default: passed in file)

## Browse In Terminal

If passed is file, open the parent folder.

- Input
  - File path (default: passed in file)

## Run Script

- Input
  - Script
    - Script Body
    - Input as argv or `{query}`
    - Languages
      - bash
      - zsh
      - zsh --no-rcs
      - python
      - perl
      - osascript
      - swift
      - External Script
        - Script File

## Web Search

Search the web with the passed in query.

- Input
  - Search Engine
    - Google
    - Bing
    - GitHub
    - Twitter
    - Wikipedia
    - YouTube
    - Facebook
    - Amazon
    - Google Translate
    - Google Maps
    - Google Images
    - LinkedIn
    - DuckDuckGo
    - Baidu
  - Browser

## Open URL

- Input
  - URL (default: passed-in URL)
    - Custom Search
      - `https://domain.com/?q={query}`
  - Open With
    - Browsers Registered
