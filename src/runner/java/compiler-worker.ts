/// <reference lib="webworker" />
// The in-browser Java compiler (javac + TeaVM, compiled to WebAssembly; public/java-compiler,
// built from teavm-javac). It is large, so it loads once, in this long-lived worker, the
// first time the reader runs edited Java.

type Request = { id: number; files: Record<string, string>; mainClass: string }
type Diagnostic = { kind: string; severity: string; file: string; line: number; message: string }

type TeaVMModule = { exports: Record<string, any> }
type Runtime = { load: (src: string | Uint8Array, options?: Record<string, unknown>) => Promise<TeaVMModule> }

const base = new URL(`${import.meta.env.BASE_URL}java-compiler/`, self.location.origin).href
let ready: Promise<{ compiler: any; diagnostics: Diagnostic[] }> | null = null

const read = <T,>(get: () => T, fallback: T): T => {
  try {
    return get() ?? fallback
  } catch {
    return fallback
  }
}

function init() {
  ready ??= (async () => {
    const runtime = (await import(/* @vite-ignore */ `${base}compiler.wasm-runtime.js`)) as Runtime
    const teavm = await runtime.load(`${base}compiler.wasm`)
    const compiler = teavm.exports.createCompiler()
    const [sdk, classlib] = await Promise.all(
      ['compile-classlib-teavm.bin', 'runtime-classlib-teavm.bin'].map(async (f) => new Int8Array(await (await fetch(base + f)).arrayBuffer())),
    )
    compiler.setSdk(sdk)
    compiler.setTeaVMClasslib(classlib)
    const diagnostics: Diagnostic[] = []
    compiler.onDiagnostic((d: any) => {
      diagnostics.push({
        kind: read(() => d.type, 'javac'),
        severity: read(() => d.severity, 'error'),
        file: read(() => d.fileName, ''),
        line: read(() => d.lineNumber, 0),
        message: read(() => d.message, ''),
      })
    })
    return { compiler, diagnostics }
  })()
  ready.catch(() => (ready = null))
  return ready
}

self.onmessage = async (event: MessageEvent<Request>) => {
  const { id, files, mainClass } = event.data
  try {
    const { compiler, diagnostics } = await init()
    diagnostics.length = 0
    compiler.clearSourceFiles()
    compiler.clearOutputFiles()
    for (const [name, text] of Object.entries(files)) compiler.addSourceFile(name, text)
    let ok = compiler.compile()
    let wasm: Uint8Array | null = null
    if (ok) {
      ok = await compiler.generateWebAssembly({ outputName: 'app', mainClass, strictMode: true, obfuscated: true })
      if (ok) {
        const out = compiler.getWebAssemblyOutputFile('app.wasm') as Int8Array
        wasm = new Uint8Array(out.byteLength)
        wasm.set(new Uint8Array(out.buffer, out.byteOffset, out.byteLength))
      }
    }
    const message = { id, ok, diagnostics: [...diagnostics], wasm }
    self.postMessage(message, wasm ? [wasm.buffer] : [])
  } catch (err) {
    self.postMessage({ id, ok: false, diagnostics: [], wasm: null, error: err instanceof Error ? `${err.message}\n${(err.stack ?? '').split('\n').slice(0, 8).join('\n')}` : String(err) })
  }
}
