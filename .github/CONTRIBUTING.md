# Contributing

If you are interested in contributing to the project, please read the following guidelines.

## Development

### Prerequisites

- Node.js LTS
- pnpm
- Bun
- Deno
- Rust

### Setup

```bash
pnpm run setup
pnpm install
pnpm --filter @kksh/gql build
```

### Run Desktop App

```bash
pnpm --filter @kksh/desktop tauri dev
# or run it within the desktop app directory
cd apps/desktop
pnpm tauri dev
```
