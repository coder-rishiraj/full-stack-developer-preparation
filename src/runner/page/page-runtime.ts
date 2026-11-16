/**
 * The runtime inside the preview frame for lesson code that needs a web page: React
 * components, react-dom/client, and DOM code. Built as one self-contained script
 * (public/runner/page-runtime.js, `npm run runner:page`) that the Run panel inlines into a
 * sandboxed iframe with an opaque origin, so lesson code cannot reach the site's storage.
 *
 * Protocol (window.postMessage):
 *   parent -> frame  { type: 'run', code, mode, candidates }  code is CommonJS (see compile.ts)
 *   frame -> parent  { type: 'ready' } | { type: 'output', stream, text } | { type: 'error', text }
 *                    | { type: 'height', height } | { type: 'done' }
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'
import * as ReactDOMServer from 'react-dom/server'
import * as JsxRuntime from 'react/jsx-runtime'
import * as zod from 'zod'
import lodash from 'lodash'
import { format, makeConsole, makeEvents, inspect, uncaughtText } from '../js/runtime'

type RunMessage = { type: 'run'; code: string; mode: 'script' | 'module'; candidates: string[] }

const post = (message: Record<string, unknown>) => window.parent.postMessage(message, '*')
const cjs = <T,>(m: T): T => ((m as { default?: T }).default ?? m)

const modules: Record<string, unknown> = {
  react: cjs(React),
  'react-dom': cjs(ReactDOM),
  'react-dom/client': cjs(ReactDOMClient),
  'react-dom/server': cjs(ReactDOMServer),
  'react/jsx-runtime': cjs(JsxRuntime),
  zod,
  lodash,
  events: makeEvents(),
  util: { inspect, format: (...a: unknown[]) => format(a) },
}

function require(name: string): unknown {
  const key = name.replace(/^node:/, '')
  if (key in modules) return modules[key]
  throw new Error(`Cannot find module '${name}' (the preview provides react, react-dom, zod and lodash)`)
}

/**
 * React APIs lessons often use without importing them (the import is implied by the lesson).
 * Each one is provided unless the code declares a name of its own.
 */
const REACT_GLOBALS = [
  'React', 'useState', 'useEffect', 'useLayoutEffect', 'useRef', 'useReducer', 'useCallback', 'useMemo',
  'useContext', 'useId', 'useTransition', 'useDeferredValue', 'useSyncExternalStore', 'useImperativeHandle',
  'useOptimistic', 'useActionState', 'use', 'createContext', 'Fragment', 'memo', 'forwardRef', 'lazy', 'Suspense',
  'StrictMode', 'startTransition', 'createElement', 'cloneElement', 'Children', 'createRoot', 'flushSync',
]

function reactGlobal(name: string): unknown {
  const react = modules.react as Record<string, unknown>
  if (name === 'React') return react
  if (name === 'createRoot') return (modules['react-dom/client'] as Record<string, unknown>).createRoot
  if (name === 'flushSync') return (modules['react-dom'] as Record<string, unknown>).flushSync
  return react[name]
}

let ran = false

async function run({ code, mode, candidates }: RunMessage) {
  if (ran) return
  ran = true
  const emit = (stream: 'out' | 'err', text: string) => post({ type: 'output', stream, text })
  const pageConsole = makeConsole(emit, () => performance.now())
  for (const [name, fn] of Object.entries(pageConsole)) (console as unknown as Record<string, unknown>)[name] = fn
  const reportError = (err: unknown, prefix = '') => post({ type: 'error', text: `${prefix}${uncaughtText(err)}` })
  window.addEventListener('error', (event) => reportError(event.error ?? event.message))
  window.addEventListener('unhandledrejection', (event) => reportError(event.reason, '(in promise) '))

  // Collect the top-level components so a lesson that only defines them still renders.
  const collect = candidates.length
    ? `\n;module.exports.__components = {${candidates.map((n) => `${JSON.stringify(n)}: typeof ${n} !== 'undefined' ? ${n} : undefined`).join(', ')}};`
    : ''
  const module = { exports: {} as Record<string, unknown> }
  try {
    const process = { env: { NODE_ENV: 'development' }, nextTick: (cb: () => void) => queueMicrotask(cb) }
    const declared = (name: string) => new RegExp(`\\b(?:const|let|var|function|class)\\s+${name}\\b|\\b${name}\\s*[,}][^;]*=\\s*(?:React|require)`).test(code)
    const injected = REACT_GLOBALS.filter((n) => !declared(n))
    const params = ['require', 'module', 'exports', 'process', ...injected]
    const args = [require, module, module.exports, process, ...injected.map(reactGlobal)]
    if (mode === 'module') {
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as FunctionConstructor
      await new AsyncFunction(...params, code + collect)(...args)
    } else {
      new Function(...params, code + collect)(...args)
    }
  } catch (err) {
    reportError(err)
  }

  // Render a component if the code did not render anything itself.
  const root = document.getElementById('root')!
  const exported = module.exports as { default?: unknown; __components?: Record<string, unknown> }
  const found = exported.__components ?? {}
  const pick =
    (typeof exported.default === 'function' ? exported.default : undefined) ??
    (typeof found.App === 'function' ? found.App : undefined) ??
    [...candidates].reverse().map((n) => found[n]).find((c) => typeof c === 'function')
  await new Promise((r) => setTimeout(r, 0))
  const bodyIsEmpty = root.childNodes.length === 0 && document.body.children.length <= 2
  if (pick && bodyIsEmpty) {
    try {
      ReactDOMClient.createRoot(root).render(React.createElement(React.StrictMode, null, React.createElement(pick as React.ComponentType)))
    } catch (err) {
      reportError(err)
    }
  }
  setTimeout(() => post({ type: 'done' }), 50)
}

window.addEventListener('message', (event: MessageEvent) => {
  if (event.data?.type === 'run') void run(event.data as RunMessage)
})

// Tell the parent how tall the page is, whenever it may have changed.
let lastHeight = 0
const reportHeight = () => {
  const body = document.body
  const margin = parseFloat(getComputedStyle(body).marginBottom) || 0
  const height = Math.ceil(Math.max(body.getBoundingClientRect().bottom + margin, body.scrollHeight, document.getElementById('root')!.getBoundingClientRect().bottom + margin))
  // A frame the browser has not laid out yet measures 0; keep the parent's default then.
  if (height > margin + 1 && height !== lastHeight) {
    lastHeight = height
    post({ type: 'height', height })
  }
}
const observer = new ResizeObserver(reportHeight)
observer.observe(document.body)
observer.observe(document.getElementById('root')!)
new MutationObserver(() => requestAnimationFrame(reportHeight)).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true })
for (const ms of [50, 200, 600, 1500]) setTimeout(reportHeight, ms)
post({ type: 'ready' })
