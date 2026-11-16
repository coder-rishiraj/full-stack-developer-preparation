/**
 * Builds public/runner/page-runtime.js: one self-contained script (React, react-dom, zod,
 * lodash and the console formatter) that the Run panel inlines into the sandboxed preview
 * frame for lesson code that needs a web page. React is the development build, so readers
 * see React's warnings (missing keys and so on) as they would while developing.
 *
 *   npm run runner:page
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

await build({
  configFile: false,
  root,
  logLevel: 'warn',
  publicDir: false,
  mode: 'development',
  resolve: { alias: { '@': path.join(root, 'src') } },
  define: { 'process.env.NODE_ENV': JSON.stringify('development') },
  build: {
    lib: {
      entry: path.join(root, 'src/runner/page/page-runtime.ts'),
      formats: ['iife'],
      name: 'PageRuntime',
      fileName: () => 'page-runtime.js',
    },
    outDir: path.join(root, 'public/runner'),
    emptyOutDir: false,
    minify: true,
    sourcemap: false,
  },
})
console.log('Wrote public/runner/page-runtime.js')
