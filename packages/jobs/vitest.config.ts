import { join } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    minify: process.env.NODE_ENV === 'development' ? false : 'terser',
    sourcemap: 'hidden',
    outDir: 'build',
    assetsDir: '.',
    emptyOutDir: true,
    target: ['chrome116', 'node20'],
    assetsInlineLimit: 0,
    lib: {
      entry: join('src', 'index.ts'),
      formats: ['es', 'cjs'],
      fileName: 'index',
      name: 'Jobs',
    },
  },
  test: {
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
