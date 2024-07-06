## Build

```bash

pnpm esbuild index.ts --bundle --outdir=dist --minify
bun build index.ts --outdir dist --minify

hyperfine --warmup 3   'bun build index.ts --outdir dist --minify'  'pnpm esbuild index.ts --bundle --outdir=dist --minify'
```
