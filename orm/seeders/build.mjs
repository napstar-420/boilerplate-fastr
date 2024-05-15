import pkg from './package.json' assert { type: 'json' };
import { builtinModules } from 'module';
import { build } from 'esbuild';

const externals = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies), ...builtinModules];

/** @type {import('esbuild').BuildOptions} */
const options = {
  external: externals.filter(dep => !dep.startsWith('@fastr')),
  /**
   * This fixes using CommonJS modules inside of the ES Module.
   * See: https://github.com/evanw/esbuild/issues/1921
   */
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
  sourcemap: false,
  minify: true,
  entryPoints: {
    index: './src/index.ts',
  },
  logLevel: 'debug',
  platform: 'node',
  target: 'node20',
  outdir: 'build',
  format: 'esm',
  bundle: true,
};

await build({
  ...options,
  outExtension: { '.js': '.mjs' },
  format: 'esm',
});
