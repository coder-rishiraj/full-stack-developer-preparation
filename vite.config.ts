import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(root, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true, // fail instead of hopping to 5174/5180
    open: false,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  // ES-module workers can split code, so the Java runner worker loads only the bundle
  // (src/runner/generated/<category>.js) the page needs instead of all of them.
  worker: {
    format: 'es',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
