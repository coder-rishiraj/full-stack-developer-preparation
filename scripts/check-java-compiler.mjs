/**
 * Measures how faithfully edited Java runs: compiles programs with the in-browser compiler
 * (public/java-compiler, the same files and the same source preparation as the Run panel's
 * src/runner/java/prepare.ts) and compares each run with the real JVM.
 *
 *   npm run java:check-compiler            Track A lesson programs and walkthrough programs
 *   npm run java:check-compiler -- a3 nc-   only lessons / problem pages whose id starts so
 *
 * Writes src/runner/generated/java-compiler-check.json (the programs that differ, and why).
 */
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
import { findJdkHome, javaBlocks, outDir, root } from './java-runner-lib.mjs'

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const compilerDir = path.join(root, 'public/java-compiler')
const jdkHome = findJdkHome()

// prepare.ts with its ?raw imports read from disk.
function loadPrepare() {
  const file = path.join(root, 'src/runner/java/prepare.ts')
  let text = readFileSync(file, 'utf8').replace(/^import (\w+) from '(.+)\?raw'$/gm, (_, name, rel) => {
    return `const ${name} = require('fs').readFileSync(${JSON.stringify(path.resolve(path.dirname(file), rel))}, 'utf8')`
  })
  text = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const exports = {}
  new Function('exports', 'require', text)(exports, (m) => (m === 'fs' ? { readFileSync } : {}))
  return exports
}
const prepare = loadPrepare()

const { load } = await import(pathToFileURL(path.join(compilerDir, 'compiler.wasm-runtime.js')).href)
const teavm = await load(new Uint8Array(readFileSync(path.join(compilerDir, 'compiler.wasm'))))
const compiler = teavm.exports.createCompiler()
compiler.setSdk(new Int8Array(readFileSync(path.join(compilerDir, 'compile-classlib-teavm.bin'))))
compiler.setTeaVMClasslib(new Int8Array(readFileSync(path.join(compilerDir, 'runtime-classlib-teavm.bin'))))
const read = (f, d) => {
  try {
    return f() ?? d
  } catch {
    return d
  }
}
let diagnostics = []
compiler.onDiagnostic((d) => diagnostics.push(`${read(() => d.fileName, '')}:${read(() => d.lineNumber, 0)}: ${read(() => d.message, '')}`.split('\n')[0]))

async function runInBrowserCompiler(unit) {
  diagnostics = []
  compiler.clearSourceFiles()
  compiler.clearOutputFiles()
  for (const [name, text] of Object.entries(unit.files)) compiler.addSourceFile(name, text)
  if (!compiler.compile()) return { compileError: diagnostics[0] ?? 'javac failed' }
  if (!(await compiler.generateWebAssembly({ outputName: 'app', mainClass: 'RunnerMain', strictMode: true }))) {
    return { compileError: `TeaVM: ${diagnostics[0] ?? 'failed'}` }
  }
  const wasm = compiler.getWebAssemblyOutputFile('app.wasm')
  let out = []
  let err = []
  const app = await load(new Uint8Array(wasm.buffer, wasm.byteOffset, wasm.byteLength), {
    installImports(o) {
      o.teavmConsole.putcharStdout = (c) => out.push(c & 0xffff)
      o.teavmConsole.putcharStderr = (c) => err.push(c & 0xffff)
    },
  })
  let threw = null
  try {
    await app.exports.main([])
  } catch (e) {
    threw = read(() => e.message, String(e))
  }
  const text = (codes) => { let s = ''; for (let i = 0; i < codes.length; i += 4096) s += String.fromCharCode(...codes.slice(i, i + 4096)); return s }
  const stdout = text(out)
  let stderr = text(err)
  const mark = stderr.lastIndexOf('\u0000status=')
  const status = mark >= 0 ? stderr.slice(mark + 8).trim() : threw ? 'error' : 'error'
  if (mark >= 0) stderr = stderr.slice(0, mark)
  return { stdout, status, stderr: threw ? `${stderr}${threw}` : stderr }
}

function jvmRun(code, extraFiles, mainClass, input, work) {
  const dir = mkdtempSync(path.join(work, 'p'))
  const files = []
  for (const [name, text] of Object.entries(extraFiles)) {
    writeFileSync(path.join(dir, name), text)
    files.push(path.join(dir, name))
  }
  const compiled = spawnSync(path.join(jdkHome, 'bin/javac'), ['-nowarn', '-d', dir, ...files], { encoding: 'utf8' })
  if (compiled.status !== 0) return null
  const run = spawnSync(path.join(jdkHome, 'bin/java'), ['-cp', dir, mainClass], { input, encoding: 'utf8', timeout: 10_000, maxBuffer: 1 << 26 })
  return { stdout: run.stdout ?? '', ok: run.status === 0, timedOut: run.error?.code === 'ETIMEDOUT' }
}

const work = mkdtempSync(path.join(os.tmpdir(), 'java-compiler-check-'))
const results = { checked: 0, same: 0, differs: [] }
const record = (id, title, ok, reason) => {
  results.checked++
  if (ok) results.same++
  else results.differs.push({ id, title, reason })
}

try {
  // Lesson programs (Track A), no input.
  const lessonDir = path.join(root, 'src/content/lessons')
  for (const file of readdirSync(lessonDir).filter((f) => /^a\d+-.*\.md$/.test(f)).sort()) {
    const id = file.replace(/\.md$/, '')
    if (only.length && !only.some((o) => id.startsWith(o))) continue
    for (const block of javaBlocks(readFileSync(path.join(lessonDir, file), 'utf8'))) {
      const mainClass = prepare.mainClassOf(block.code)
      if (!mainClass) continue
      const userFile = prepare.fileNameFor(block.code, mainClass)
      const jvm = jvmRun(block.code, { [userFile]: block.code }, mainClass, '', work)
      if (!jvm || jvm.timedOut) continue // not a standalone program on the JVM either
      const unit = prepare.programUnit(block.code, '')
      const web = await runInBrowserCompiler(unit)
      if (web.compileError) record(id, block.title, false, `does not compile: ${web.compileError}`)
      else if (web.stdout !== jvm.stdout || (web.status === 'ok') !== jvm.ok) {
        const a = jvm.stdout.split('\n')
        const b = web.stdout.split('\n')
        const i = Math.max(0, a.findIndex((l, k) => l !== b[k]))
        record(id, block.title, false, `line ${i + 1}: JVM ${JSON.stringify((a[i] ?? '').slice(0, 60))}, browser ${JSON.stringify((b[i] ?? '').slice(0, 60))} ${web.stderr.slice(0, 80)}`)
      } else record(id, block.title, true)
    }
  }

  // Walkthrough programs, on their samples.
  const samples = JSON.parse(readFileSync(path.join(root, 'src/content/problem-pages/run-samples.json'), 'utf8'))
  const manifest = JSON.parse(readFileSync(path.join(outDir, 'manifest.json'), 'utf8'))
  const harnesses = JSON.parse(readFileSync(path.join(outDir, 'java-harness.json'), 'utf8'))
  const runtimeSrc = path.join(root, 'tools/java-runner/src/main/java/runner')
  for (const [id, page] of Object.entries(manifest.pages)) {
    if (only.length && !only.some((o) => id.startsWith(o))) continue
    const md = readFileSync(path.join(root, 'src/content/problem-pages', `${id}.md`), 'utf8')
    const blocks = javaBlocks(md)
    for (const program of page.programs) {
      const block = blocks.find((b) => b.title === program.title)
      if (!block) continue
      for (const sample of samples[id].samples) {
        const harness = harnesses[program.key]
        const unit = harness ? prepare.harnessUnit(block.code, sample.input, harness.main, harness.extra) : prepare.programUnit(block.code, sample.input)
        const web = await runInBrowserCompiler(unit)
        // The JVM side: the same sources, with the JVM's own System.in.
        const jvmFiles = harness
          ? {
              [prepare.fileNameFor(block.code, 'Solution')]: block.code,
              'Main.java': harness.main,
              ...(harness.extra ? { 'Harness.java': prepare.withoutPublicTypes(harness.extra) } : {}),
              'In.java': readFileSync(path.join(runtimeSrc, 'In.java'), 'utf8'),
              'Show.java': readFileSync(path.join(runtimeSrc, 'Show.java'), 'utf8'),
            }
          : { 'Main.java': block.code }
        const jvm = jvmRun(block.code, jvmFiles, 'Main', sample.input, work)
        if (!jvm) continue
        if (web.compileError) record(id, `${program.title} (${sample.label})`, false, `does not compile: ${web.compileError}`)
        else record(id, `${program.title} (${sample.label})`, web.stdout === jvm.stdout && (web.status === 'ok') === jvm.ok, `JVM ${JSON.stringify(jvm.stdout.slice(0, 60))}, browser ${JSON.stringify(web.stdout.slice(0, 60))} ${web.stderr.slice(0, 80)}`)
      }
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}
writeFileSync(path.join(outDir, 'java-compiler-check.json'), JSON.stringify(results, null, 1) + '\n')
console.log(`In-browser compiler matches the JVM on ${results.same} of ${results.checked} runs.`)
