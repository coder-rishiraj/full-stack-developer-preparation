/**
 * Runs one program with the browser runtime (src/runner/js/runtime.ts) inside a fresh Node
 * `vm` context, which has only the standard JavaScript built-ins, like a Web Worker without
 * the DOM. Used by scripts/build-js-lesson-runner.mjs to compare the runtime with real Node.
 *
 * stdin: JSON { runtimeFile, code, mode }   stdout: JSON { events, status }
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

// The packages the runner provides, from the repo (the browser gets the same versions).
const requireFromRepo = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'package.json'))

const input = JSON.parse(readFileSync(0, 'utf8'))
const context = vm.createContext({})
const runtimeExports = {}
vm.runInContext(`(function (exports) {\n${readFileSync(input.runtimeFile, 'utf8')}\n})`, context)(runtimeExports)
const g = vm.runInContext('globalThis', context)
g.performance = { now: () => performance.now(), timeOrigin: performance.timeOrigin }
// The Web APIs a browser Web Worker has (and Node shares), which a bare vm context lacks.
for (const name of [
  'AbortController', 'AbortSignal', 'Event', 'EventTarget', 'CustomEvent', 'DOMException',
  'TextEncoder', 'TextDecoder', 'URL', 'URLSearchParams', 'structuredClone', 'atob', 'btoa',
  'crypto', 'Blob', 'MessageChannel', 'MessagePort', 'BroadcastChannel', 'Headers', 'Request',
  'Response', 'FormData', 'ReadableStream', 'WritableStream', 'TransformStream',
  'CompressionStream', 'DecompressionStream', 'TextEncoderStream', 'TextDecoderStream',
  'WebAssembly', 'File',
]) {
  if (globalThis[name] !== undefined) g[name] = globalThis[name]
}

process.on('unhandledRejection', (reason, promise) => g.__trackRejection?.(promise, reason, false))
process.on('rejectionHandled', (promise) => g.__trackRejection?.(promise, undefined, true))

const modules = {}
for (const name of input.packages ?? []) modules[name] = requireFromRepo(name)

const events = []
const status = await runtimeExports.runProgram({
  modules,
  code: input.code,
  mode: input.mode,
  global: g,
  emit: (e) => events.push(e),
  hostYield: () => new Promise((resolve) => setImmediate(resolve)),
})
process.stdout.write(JSON.stringify({ events, status }))
process.exit(0)
