/**
 * Preparing lesson JavaScript/TypeScript to run, shared by the browser (ts-worker.ts) and the
 * build (scripts/build-js-lesson-runner.mjs). The TypeScript compiler is passed in, so this
 * file has no imports and the browser loads the compiler only when it is needed.
 */
import type TS from 'typescript'
import type { ProgramMode } from './runtime'

export type SourceLang = 'js' | 'ts' | 'jsx' | 'tsx'

export const MAIN_FILE = { js: 'main.js', ts: 'main.ts', jsx: 'main.jsx', tsx: 'main.tsx' } as const

/** Lesson languages that the runner handles. */
export function sourceLang(language: string): SourceLang | null {
  if (language === 'javascript' || language === 'js' || language === 'mjs' || language === 'cjs') return 'js'
  if (language === 'typescript' || language === 'ts') return 'ts'
  if (language === 'jsx') return 'jsx'
  if (language === 'tsx') return 'tsx'
  return null
}

export const isTypeScript = (lang: SourceLang) => lang === 'ts' || lang === 'tsx'

/**
 * npm packages the runner provides (bundled with the site). `import`/`require` of anything
 * else, or of a relative file, fails as it would in a one-file Node program without them.
 */
export const PACKAGES = ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', 'react-dom/server', 'zod', 'lodash'] as const
export type PackageName = (typeof PACKAGES)[number]

/** The provided packages the code imports or requires (JSX also needs react/jsx-runtime). */
export function packagesUsed(code: string, lang: SourceLang): PackageName[] {
  const names = new Set<string>()
  for (const m of code.matchAll(/(?:\bfrom\s*|\bimport\s*|\brequire\s*\(\s*)['"]([^'"]+)['"]/g)) names.add(m[1])
  if (lang === 'jsx' || lang === 'tsx') {
    names.add('react')
    names.add('react/jsx-runtime')
  }
  if (names.has('react-dom/client') || names.has('react-dom/server')) names.add('react-dom')
  return PACKAGES.filter((p) => names.has(p))
}

/**
 * Where the code runs: `page` (a sandboxed frame with a real DOM, for React components and
 * DOM code) or `node` (the Node-like worker, for programs that print).
 */
export type RunEnv = 'node' | 'page'
export function runEnv(code: string, lang: SourceLang): RunEnv {
  if (/\b(document|window|localStorage|sessionStorage|navigator|location|requestAnimationFrame|customElements|HTMLElement)\b\s*[.([]/.test(code)) return 'page'
  if (/\bcreateRoot\s*\(|\bhydrateRoot\s*\(|ReactDOM\.render\s*\(/.test(code)) return 'page'
  if ((lang === 'jsx' || lang === 'tsx') && !/react-dom\/server|renderToString|renderToStaticMarkup/.test(code)) return 'page'
  return 'node'
}

/**
 * How Node would run the code: as an ES module when it has import/export statements or
 * top-level await (Node 22 detects these), otherwise as a CommonJS script (sloppy mode,
 * `this` is module.exports).
 */
export function programMode(code: string): ProgramMode {
  if (/^import\s*(?:[\w*{]|['"])/m.test(code)) return 'module'
  if (/^export\s+(default\b|const\b|let\b|var\b|function\b|async\b|class\b|type\b|interface\b|enum\b|abstract\b|declare\b|\{|\*)/m.test(code)) return 'module'
  // Top-level await: an unindented line using await outside a function.
  if (/^(?!\s)(?!.*\bfunction\b)(?!.*=>).*\bawait\b/m.test(code)) return 'module'
  return 'script'
}

/** Whether the browser needs the TypeScript compiler to run this code. */
export function needsCompiler(lang: SourceLang, mode: ProgramMode): boolean {
  return lang !== 'js' || mode === 'module'
}

/**
 * The code as the runtime runs it: types removed, and import/export turned into
 * require/exports (CommonJS), so it can run inside a function. Scripts stay scripts.
 */
export function compileForRun(ts: typeof TS, code: string, lang: SourceLang, mode: ProgramMode): string {
  if (!needsCompiler(lang, mode)) return code
  return ts.transpileModule(code, {
    fileName: MAIN_FILE[lang],
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      // JSX needs an import of react/jsx-runtime, which only a module can have.
      moduleDetection: mode === 'module' || lang === 'jsx' || lang === 'tsx' ? ts.ModuleDetectionKind.Force : ts.ModuleDetectionKind.Legacy,
      esModuleInterop: true,
      useDefineForClassFields: true,
      experimentalDecorators: false,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
}

/** The code as plain JavaScript for Node (used by the build's comparison run). */
export function compileForNode(ts: typeof TS, code: string, lang: SourceLang, mode: ProgramMode): string {
  if (lang === 'js') return code
  return ts.transpileModule(code, {
    fileName: MAIN_FILE[lang],
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: mode === 'module' ? ts.ModuleKind.ESNext : ts.ModuleKind.CommonJS,
      // JSX needs an import of react/jsx-runtime, which only a module can have.
      moduleDetection: mode === 'module' || lang === 'jsx' || lang === 'tsx' ? ts.ModuleDetectionKind.Force : ts.ModuleDetectionKind.Legacy,
      useDefineForClassFields: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
}

/** The lib files the type check uses: the latest ECMAScript plus the DOM (for console and timers). */
export const ROOT_LIBS = ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts']

/** Globals the runtime provides beyond the DOM lib, so the checker knows them. */
export const NODE_GLOBALS = `export {}
declare global {
  var process: {
    nextTick(callback: (...args: any[]) => void, ...args: any[]): void
    exit(code?: number): never
    exitCode: number | undefined
    env: Record<string, string | undefined>
    argv: string[]
    platform: string
    version: string
    stdout: { write(chunk: string): boolean; isTTY: boolean; columns: number }
    stderr: { write(chunk: string): boolean }
    hrtime: { (time?: [number, number]): [number, number]; bigint(): bigint }
    memoryUsage(): { rss: number; heapTotal: number; heapUsed: number; external: number; arrayBuffers: number }
    cwd(): string
    on(event: string, listener: (...args: any[]) => void): unknown
  }
  function setImmediate(callback: (...args: any[]) => void, ...args: any[]): unknown
  function clearImmediate(handle: unknown): void
  var global: typeof globalThis
  var require: (id: string) => any
  var module: { exports: any }
  var exports: any
  var __filename: string
  var __dirname: string
  namespace JSX {
    interface IntrinsicElements {
      [name: string]: any
    }
    type Element = any
  }
}
`

/** The provided packages, for the type checker (typed loosely: their own types are not loaded). */
export const PACKAGE_DECLARATIONS = "declare module 'react'\ndeclare module 'react/jsx-runtime'\ndeclare module 'react-dom'\ndeclare module 'react-dom/client'\ndeclare module 'react-dom/server'\ndeclare module 'zod'\ndeclare module 'lodash'\n"

/** Names of the lib files a lib file references (/// <reference lib="..." />). */
export function libReferences(text: string): string[] {
  return [...text.matchAll(/\/\/\/\s*<reference\s+lib="([^"]+)"/g)].map((m) => `lib.${m[1].toLowerCase()}.d.ts`)
}

/**
 * Type-checks the code the way `tsc --strict` would and returns the errors in tsc's plain
 * format ("main.ts(3,7): error TS2322: ..."). `libs` holds every lib file reachable from
 * ROOT_LIBS; `cache` keeps their parsed form between calls.
 */
export function typeCheck(
  ts: typeof TS,
  code: string,
  libs: Map<string, string>,
  cache: Map<string, TS.SourceFile>,
  lang: SourceLang = 'ts',
): string[] {
  const main = lang === 'tsx' ? '/main.tsx' : '/main.ts'
  const options: TS.CompilerOptions = {
    strict: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    moduleDetection: ts.ModuleDetectionKind.Force,
    lib: ROOT_LIBS,
    noEmit: true,
    skipLibCheck: true,
    types: [],
    useDefineForClassFields: true,
    jsx: ts.JsxEmit.ReactJSX,
    jsxImportSource: 'react',
  }
  const files: Record<string, string> = { [main]: code, '/node-globals.d.ts': NODE_GLOBALS, '/packages.d.ts': PACKAGE_DECLARATIONS }
  const host: TS.CompilerHost = {
    getSourceFile(fileName, languageVersion) {
      const base = fileName.slice(fileName.lastIndexOf('/') + 1)
      if (fileName.startsWith('/lib/')) {
        const text = libs.get(base)
        if (text === undefined) return undefined
        let sf = cache.get(base)
        if (!sf) {
          sf = ts.createSourceFile(fileName, text, languageVersion)
          cache.set(base, sf)
        }
        return sf
      }
      const text = files[fileName]
      return text === undefined ? undefined : ts.createSourceFile(fileName, text, languageVersion)
    },
    getDefaultLibFileName: () => '/lib/lib.d.ts',
    getDefaultLibLocation: () => '/lib',
    writeFile: () => {},
    getCurrentDirectory: () => '/',
    getCanonicalFileName: (f) => f,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n',
    fileExists: (f) => f in files || (f.startsWith('/lib/') && libs.has(f.slice(5))),
    readFile: (f) => files[f] ?? (f.startsWith('/lib/') ? libs.get(f.slice(5)) : undefined),
  }
  const program = ts.createProgram([main, '/node-globals.d.ts', '/packages.d.ts'], options, host)
  const source = program.getSourceFile(main)
  const diagnostics = [...program.getSyntacticDiagnostics(source), ...program.getSemanticDiagnostics(source)]
  const formatHost: TS.FormatDiagnosticsHost = {
    getCanonicalFileName: (f) => f,
    getCurrentDirectory: () => '/',
    getNewLine: () => '\n',
  }
  return diagnostics.map((d) => ts.formatDiagnostic(d, formatHost).trimEnd())
}
