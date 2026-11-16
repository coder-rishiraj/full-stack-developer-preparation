/// <reference lib="webworker" />
// Runs one JavaScript program with the Node-like runtime. A fresh worker per run gives every
// program clean globals, and lets the page stop a program that never ends.
import { runProgram, type OutputEvent, type ProgramMode } from './runtime'
import { loadPackages } from './packages'
import type { PackageName } from './compile'

const g = self as unknown as Record<string, any>
let batch: OutputEvent[] = []

const flush = () => {
  if (batch.length > 0) {
    self.postMessage({ type: 'output', events: batch })
    batch = []
  }
}

// A real macrotask (not setTimeout, which the runtime replaces), so promise callbacks run.
const channel = new MessageChannel()
const waiting: (() => void)[] = []
channel.port1.onmessage = () => waiting.shift()?.()
const hostYield = () =>
  new Promise<void>((resolve) => {
    flush()
    waiting.push(resolve)
    channel.port2.postMessage(0)
  })

self.addEventListener('unhandledrejection', (event) => {
  event.preventDefault()
  g.__trackRejection?.(event.promise, event.reason, false)
})
self.addEventListener('rejectionhandled', (event) => {
  g.__trackRejection?.(event.promise, undefined, true)
})

self.onmessage = async (event: MessageEvent<{ code: string; mode: ProgramMode; packages: PackageName[] }>) => {
  const modules = await loadPackages(event.data.packages ?? [])
  const start = performance.now()
  const status = await runProgram({
    modules,
    code: event.data.code,
    mode: event.data.mode,
    global: g,
    emit: (e) => batch.push(e),
    hostYield,
  })
  flush()
  self.postMessage({ type: 'done', status, ms: performance.now() - start })
}
