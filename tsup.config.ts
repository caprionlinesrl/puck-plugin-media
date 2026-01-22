import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@puckeditor/core'],
  injectStyle: false,
  loader: {
    '.css': 'local-css',
  },
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
