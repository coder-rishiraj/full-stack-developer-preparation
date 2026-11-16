/**
 * Renders one lesson block in jsdom with the preview-frame runtime (public/runner/page-runtime.js),
 * the way the Run panel's sandboxed frame does, and reports its console output and any
 * uncaught error. Used by scripts/build-js-lesson-runner.mjs for code that needs a web page.
 *
 * stdin: JSON { code, mode, candidates }   stdout: JSON { events, errors }
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM, VirtualConsole } from 'jsdom'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const input = JSON.parse(readFileSync(0, 'utf8'))
const runtime = readFileSync(path.join(root, 'public/runner/page-runtime.js'), 'utf8')

const events = []
const errors = []
const virtualConsole = new VirtualConsole()
virtualConsole.on('jsdomError', (e) => errors.push(`jsdom: ${e.message}`))
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  virtualConsole,
})
const { window } = dom
// Browser APIs a real page has that jsdom lacks (React's scheduler uses MessageChannel).
for (const name of ['MessageChannel', 'MessagePort', 'TextEncoder', 'TextDecoder', 'structuredClone', 'AbortSignal', 'queueMicrotask']) {
  if (window[name] === undefined && globalThis[name] !== undefined) window[name] = globalThis[name]
}
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
let done
const finished = new Promise((r) => (done = r))
window.addEventListener('message', (event) => {
  const data = event.data
  if (!data || typeof data !== 'object') return
  if (data.type === 'ready') window.postMessage({ type: 'run', code: input.code, mode: input.mode, candidates: input.candidates }, '*')
  else if (data.type === 'output') events.push({ stream: data.stream, text: data.text })
  else if (data.type === 'error') errors.push(data.text)
  else if (data.type === 'done') setTimeout(done, 300)
})
const script = window.document.createElement('script')
script.textContent = runtime
window.document.body.appendChild(script)
await Promise.race([finished, new Promise((r) => setTimeout(r, 8000))])
const html = window.document.getElementById('root')?.innerHTML ?? ''
process.stdout.write(JSON.stringify({ events, errors, rendered: html.length }))
window.close()
process.exit(0)
