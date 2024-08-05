# @kksh/cli

This is a CLI tool for developers to develop Kunkun extensions.

## Usage

```bash
# Create an extension template first
npm init kunkun@latest

# You can verify the extension manifest, this expect `npm run build` is done already and all generated artifacts listed in manifest is present.
npx @kksh/cli verify <path to extension>

# Build extension with docker, simulate how Kunkun's CI builds the extension
npx @kksh/cli build <path to extension>
```
