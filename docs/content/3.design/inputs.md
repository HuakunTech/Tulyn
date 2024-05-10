# Input Components design

## Keyword Trigger

- Input
  - Keyword (trigger word)
  - Workflow Icon
  - Placeholder Title
  - Placeholder Subtext

## File Filter

- Input
  - Keyword (trigger word)
  - Workflow Icon
  - Placeholder Title
  - Placeholder Subtext
  - Search Scope
  - Filter
    - File Type (dir / file / both)
    - Extension
    - Regex
    - Date Range
  - Limit and Sort
    - Result limit
    - Sort by
      - Creation Time
      - Modified Time
      - Jarvis Knowledge
- Output
  - A single string of file path

## Script Filter

https://www.alfredapp.com/help/workflows/inputs/script-filter/

- Input
  - Keyword (trigger word)
  - Workflow Icon
  - Placeholder Title
  - Placeholder Subtext
  - "Please Wait" Subtext
  - Script
    - Language
    - Input as argv or `{query}`
- Output
  - items
