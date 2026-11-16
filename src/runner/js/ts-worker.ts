/// <reference lib="webworker" />
// The TypeScript compiler, kept in one long-lived worker: it is large, so it loads once (on
// the first TypeScript run, or the first JavaScript module), and keeps the parsed lib files
// between runs so later type checks are fast.
import type TS from 'typescript'
import { compileForRun, libReferences, ROOT_LIBS, typeCheck, type SourceLang } from './compile'
import type { ProgramMode } from './runtime'

type Request = { id: number; code: string; lang: SourceLang; mode: ProgramMode; check: boolean }

const libSources = import.meta.glob<string>('/node_modules/typescript/lib/lib.*.d.ts', { query: '?raw', import: 'default' })

let compiler: Promise<typeof TS> | null = null
const libs = new Map<string, string>()
const parsed = new Map<string, TS.SourceFile>()
let libsReady: Promise<void> | null = null

function loadCompiler(): Promise<typeof TS> {
  compiler ??= import('typescript').then((m) => ((m as { default?: typeof TS }).default ?? (m as typeof TS)))
  return compiler
}

/** Loads the root lib files and everything they reference. */
function loadLibs(): Promise<void> {
  libsReady ??= (async () => {
    const queue = [...ROOT_LIBS]
    while (queue.length > 0) {
      const name = queue.shift()!
      if (libs.has(name)) continue
      const load = libSources[`/node_modules/typescript/lib/${name}`]
      if (!load) continue
      const text = await load()
      libs.set(name, text)
      for (const ref of libReferences(text)) if (!libs.has(ref)) queue.push(ref)
    }
  })()
  return libsReady
}

self.onmessage = async (event: MessageEvent<Request>) => {
  const { id, code, lang, mode, check } = event.data
  try {
    const ts = await loadCompiler()
    const js = compileForRun(ts, code, lang, mode)
    let diagnostics: string[] | null = null
    if (check) {
      await loadLibs()
      diagnostics = typeCheck(ts, code, libs, parsed, lang)
    }
    self.postMessage({ id, js, diagnostics })
  } catch (err) {
    self.postMessage({ id, error: err instanceof Error ? err.message : String(err) })
  }
}
