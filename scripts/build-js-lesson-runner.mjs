/**
 * Decides which JavaScript/TypeScript lesson blocks get an editable Run panel.
 *
 *   npm run lessons:js-runner
 *
 * Every ```js / ```javascript / ```ts / ```typescript block in src/content/lessons/*.md is run
 * twice: with the browser runtime (src/runner/js/runtime.ts, inside a bare `vm` context, via
 * scripts/js-gate-child.mjs) and with real Node (`node main.mjs` / `node main.cjs`; TypeScript
 * with its types removed). A block gets a Run panel only if both print the same standard
 * output and console errors and end the same way (same uncaught error, same exit code).
 * Stack-frame lines ("    at ...") are ignored, since file paths differ.
 *
 * Blocks that need a web page (document, window), npm packages, other files or a server do
 * not get a panel, and neither do blocks Node does not finish within 10 s. The reasons are
 * listed under "excluded" in src/runner/generated/js-lessons-manifest.json.
 *
 * Nothing is compiled ahead of time: the browser runs the reader's (possibly edited) code
 * directly, so this script only needs Node and the repo's TypeScript.
 */
import { spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import ts from 'typescript'
import { codeHash, outDir, root } from './java-runner-lib.mjs'

const lessonDir = path.join(root, 'src/content/lessons')
const manifestPath = path.join(outDir, 'js-lessons-manifest.json')
const NODE_TIMEOUT_MS = 10_000
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))

/** Loads a TypeScript source file of the runner as CommonJS. */
function loadModule(file) {
  const text = ts.transpileModule(readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const exports = {}
  new Function('exports', 'require', text)(exports, () => ({}))
  return { exports, text }
}

const compile = loadModule('src/runner/js/compile.ts').exports
const runtime = loadModule('src/runner/js/runtime.ts')
const { parseLesson } = loadModule('src/lib/lesson-markdown.ts').exports

/** Every code block, exactly as the site parses it (inside lists and callouts too). */
function codeBlocks(markdown) {
  const out = []
  const walk = (blocks) => {
    for (const b of blocks) {
      if (b.type === 'code') out.push({ language: b.language, title: b.title ?? '', code: b.code })
      if (b.blocks) walk(b.blocks)
      if (b.items) for (const item of b.items) if (item.children) walk(item.children)
    }
  }
  walk(parseLesson(markdown).blocks)
  return out
}

function runProcess(cmd, args, { input = '', cwd, timeout = NODE_TIMEOUT_MS } = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, env: { PATH: process.env.PATH, NODE_NO_WARNINGS: '1' } })
    let stdout = ''
    let stderr = ''
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, timeout)
    child.stdout.on('data', (d) => (stdout += d))
    child.stderr.on('data', (d) => (stderr += d))
    child.on('close', (status) => {
      clearTimeout(timer)
      resolve({ status, stdout, stderr, timedOut })
    })
    child.stdin.end(input)
  })
}

async function pool(items, size, fn) {
  const results = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++
        results[i] = await fn(items[i], i)
      }
    }),
  )
  return results
}

const stripFrames = (text) => text.replace(/^[ \t]+at .*(\n|$)/gm, '')

/** Node's stderr split into console output and the crash report (if it crashed). */
function splitNodeStderr(stderr) {
  const lines = stderr.split('\n')
  const start = lines.findIndex((l) => /^(file:\/\/)?\/.*:\d+$/.test(l) || /^node:internal\//.test(l))
  if (start < 0) return { console: stderr, errorLine: null }
  const crash = lines.slice(start)
  const errorLine =
    crash.find((l) => /^[A-Za-z_$][\w$]*(?: \[[\w$]+\])?: /.test(l) || /^[A-Za-z_$][\w$]*Error$/.test(l) || /^Uncaught /.test(l) || /^\[UnhandledPromiseRejection/.test(l)) ?? ''
  return { console: lines.slice(0, start).join('\n'), errorLine }
}

const BROWSER_GLOBALS = /^ReferenceError: (document|window|localStorage|sessionStorage|navigator|location|alert|HTMLElement|Element|customElements|requestAnimationFrame|IntersectionObserver|MutationObserver|ResizeObserver|indexedDB|self) is not defined/

function firstDifference(a, b) {
  const x = a.split('\n')
  const y = b.split('\n')
  const i = x.findIndex((line, k) => line !== y[k])
  const k = i < 0 ? Math.min(x.length, y.length) : i
  return `line ${k + 1}: Node ${JSON.stringify((x[k] ?? '').slice(0, 70))}, runner ${JSON.stringify((y[k] ?? '').slice(0, 70))}`
}

// ---------------------------------------------------------------- run

const cacheDir = path.join(root, 'node_modules/.cache')
mkdirSync(cacheDir, { recursive: true })
// Inside the repo, so programs that import react, zod or lodash resolve them as the runner provides them.
const work = mkdtempSync(path.join(cacheDir, 'js-lessons-'))
const runtimeFile = path.join(work, 'runtime.js')
writeFileSync(runtimeFile, runtime.text)

const items = []
for (const file of readdirSync(lessonDir).filter((f) => f.endsWith('.md')).sort()) {
  const lessonId = file.replace(/\.md$/, '')
  if (only.length > 0 && !only.some((o) => lessonId.startsWith(o))) continue
  for (const block of codeBlocks(readFileSync(path.join(lessonDir, file), 'utf8'))) {
    const lang = compile.sourceLang(block.language)
    if (!lang) continue
    items.push({ lessonId, title: block.title, lang, code: block.code })
  }
}
console.log(`Checking ${items.length} JavaScript/TypeScript block(s) against Node…`)

let done = 0
const componentNames = (code) => [
  ...new Set([...code.matchAll(/^(?:export\s+(?:default\s+)?)?(?:async\s+)?(?:function\s*\*?\s*|const\s+|let\s+|var\s+|class\s+)([A-Z][A-Za-z0-9_]*)/gm)].map((m) => m[1])),
]

/** Code that needs a page: render it in jsdom and require that it renders without an uncaught error. */
async function checkPage(item, mode) {
  let forRun
  try {
    forRun = compile.compileForRun(ts, item.code, item.lang, mode)
  } catch (err) {
    return { reason: `could not be compiled: ${err.message}` }
  }
  const res = await runProcess(process.execPath, [path.join(root, 'scripts/js-page-gate-child.mjs')], {
    input: JSON.stringify({ code: forRun, mode, candidates: componentNames(item.code) }),
    timeout: 20_000,
  })
  if (res.timedOut || res.status !== 0) return { reason: `the preview did not finish (${res.stderr.split('\n')[0].slice(0, 120)})` }
  const out = JSON.parse(res.stdout)
  const errors = out.errors.filter((e) => !/^jsdom: Not implemented/.test(e))
  if (errors.length > 0) return { reason: `fails in the preview: ${errors[0].split('\n')[0].slice(0, 140)}` }
  return { mode, env: 'page' }
}

const results = await pool(items, Math.max(2, os.cpus().length - 1), async (item, i) => {
  const mode = compile.programMode(item.code)
  if (compile.runEnv(item.code, item.lang) === 'page') {
    const r = await checkPage(item, mode)
    if (++done % 250 === 0) console.log(`  ${done} / ${items.length}`)
    return r
  }
  const dir = path.join(work, `b${i}`)
  mkdirSync(dir)
  let forNode
  let forRun
  try {
    forNode = compile.compileForNode(ts, item.code, item.lang, mode)
    forRun = compile.compileForRun(ts, item.code, item.lang, mode)
  } catch (err) {
    return { reason: `could not be compiled: ${err.message}` }
  }
  const file = mode === 'module' ? 'main.mjs' : 'main.cjs'
  writeFileSync(path.join(dir, file), forNode)
  const [node, mine] = await Promise.all([
    runProcess(process.execPath, [file], { cwd: dir }),
    runProcess(process.execPath, [path.join(root, 'scripts/js-gate-child.mjs')], {
      input: JSON.stringify({ runtimeFile, code: forRun, mode, packages: compile.packagesUsed(item.code, item.lang) }),
      timeout: 20_000,
    }),
  ])
  if (++done % 250 === 0) console.log(`  ${done} / ${items.length}`)
  if (node.timedOut) return { reason: 'Node does not finish within 10 s (a server, an endless timer, or a long computation)' }
  if (mine.timedOut || mine.status !== 0) return { reason: `the runner did not finish (${mine.stderr.split('\n')[0].slice(0, 120)})` }
  const run = JSON.parse(mine.stdout)
  const out = run.events.filter((e) => e.stream === 'out').map((e) => e.text).join('')
  const errEvents = run.events.filter((e) => e.stream === 'err').map((e) => e.text)
  const nodeErr = splitNodeStderr(node.stderr)

  if (node.status !== 0 && nodeErr.errorLine !== null) {
    if (BROWSER_GLOBALS.test(nodeErr.errorLine)) return { reason: `needs a web page: ${nodeErr.errorLine.slice(0, 80)}` }
    if (/Cannot find (module|package)|ERR_MODULE_NOT_FOUND|ENOENT/.test(node.stderr)) {
      return { reason: `needs a file or package that is not part of the lesson: ${nodeErr.errorLine.slice(0, 100)}` }
    }
  }
  if (node.status === 0 && run.status === 'error') {
    const line = errEvents.at(-1)?.split('\n')[0] ?? ''
    const missing = line.match(/ReferenceError: (\w+) is not defined/)
    return { reason: missing ? `uses ${missing[1]}, which the browser runner does not have` : `fails in the runner: ${line.slice(0, 120)}` }
  }
  if (stripFrames(node.stdout) !== stripFrames(out)) return { reason: `prints different output (${firstDifference(stripFrames(node.stdout), stripFrames(out))})` }

  let consoleErr = errEvents.join('')
  if (run.status === 'error') consoleErr = errEvents.slice(0, -1).join('')
  if (stripFrames(nodeErr.console).trimEnd() !== stripFrames(consoleErr).trimEnd()) {
    return { reason: `prints different console errors (${firstDifference(stripFrames(nodeErr.console), stripFrames(consoleErr))})` }
  }
  if (node.status === 0 && run.status !== 'ok') return { reason: `ends differently (Node exits normally, the runner: ${run.status})` }
  if (node.status !== 0) {
    if (nodeErr.errorLine === null) {
      if (run.status !== `exit ${node.status}`) return { reason: `ends differently (Node exit code ${node.status}, the runner: ${run.status})` }
    } else {
      const myLine = errEvents.at(-1)?.split('\n')[0] ?? ''
      if (run.status !== 'error') return { reason: `ends differently (Node throws ${nodeErr.errorLine.slice(0, 80)})` }
      const normalise = (l) => l.replace(/^Uncaught /, '').trim()
      if (normalise(myLine) !== normalise(nodeErr.errorLine)) {
        return { reason: `throws a different error (Node ${JSON.stringify(nodeErr.errorLine.slice(0, 80))}, runner ${JSON.stringify(myLine.slice(0, 80))})` }
      }
    }
  }
  return { mode, env: 'node' }
})
rmSync(work, { recursive: true, force: true })

const previous = (() => {
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8'))
  } catch {
    return { lessons: {}, excluded: {} }
  }
})()
const lessons = {}
const excluded = {}
if (only.length > 0) {
  for (const [id, v] of Object.entries(previous.lessons ?? {})) if (!only.some((o) => id.startsWith(o))) lessons[id] = v
  for (const [id, v] of Object.entries(previous.excluded ?? {})) if (!only.some((o) => id.startsWith(o))) excluded[id] = v
}
items.forEach((item, i) => {
  const r = results[i]
  if (r.reason) {
    const env = compile.runEnv(item.code, item.lang)
    ;(excluded[item.lessonId] ??= []).push({ hash: codeHash(item.code), title: item.title, lang: item.lang, env, reason: r.reason })
  }
  else (lessons[item.lessonId] ??= []).push({ hash: codeHash(item.code), lang: item.lang, env: r.env })
})
const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]))
mkdirSync(outDir, { recursive: true })
writeFileSync(manifestPath, JSON.stringify({ lessons: sorted(lessons), excluded: sorted(excluded) }, null, 2) + '\n')
const runnable = Object.values(lessons).reduce((n, l) => n + l.length, 0)
const total = runnable + Object.values(excluded).reduce((n, l) => n + l.length, 0)
console.log(`${runnable} of ${total} JavaScript/TypeScript blocks can be run in the browser.`)
