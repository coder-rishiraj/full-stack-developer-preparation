/// <reference lib="webworker" />
// Runs one compiled program (WebAssembly from the in-browser compiler). A fresh worker per run
// gives clean static state and lets the page stop a program that never ends.

const base = new URL(`${import.meta.env.BASE_URL}java-compiler/`, self.location.origin).href
const STATUS_MARK = '\u0000status='

self.onmessage = async (event: MessageEvent<{ wasm: Uint8Array }>) => {
  // putchar receives UTF-16 code units (Java chars).
  let stdout = ''
  let stderr = ''
  const flushAt = 4096
  let pendingOut: number[] = []
  let pendingErr: number[] = []
  const drain = () => {
    if (pendingOut.length) stdout += String.fromCharCode(...pendingOut)
    if (pendingErr.length) stderr += String.fromCharCode(...pendingErr)
    pendingOut = []
    pendingErr = []
  }
  const start = performance.now()
  let status = 'ok'
  try {
    const runtime = (await import(/* @vite-ignore */ `${base}compiler.wasm-runtime.js`)) as {
      load: (src: Uint8Array, options: Record<string, unknown>) => Promise<{ exports: { main: (args: string[]) => unknown } }>
    }
    const app = await runtime.load(event.data.wasm, {
      installImports(imports: { teavmConsole: Record<string, (c: number) => void> }) {
        imports.teavmConsole.putcharStdout = (c: number) => {
          pendingOut.push(c & 0xffff)
          if (pendingOut.length >= flushAt) drain()
        }
        imports.teavmConsole.putcharStderr = (c: number) => {
          pendingErr.push(c & 0xffff)
          if (pendingErr.length >= flushAt) drain()
        }
      },
    })
    await app.exports.main([])
  } catch (err) {
    drain()
    stderr += `${err instanceof Error ? err.message : String(err)}\n`
    status = 'error'
  }
  drain()
  const mark = stderr.lastIndexOf(STATUS_MARK)
  if (mark >= 0) {
    status = stderr.slice(mark + STATUS_MARK.length).trim()
    stderr = stderr.slice(0, mark)
  } else if (status === 'ok') {
    status = 'error'
  }
  self.postMessage({ status, stdout, stderr, ms: performance.now() - start })
}
