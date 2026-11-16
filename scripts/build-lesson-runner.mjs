/**
 * Builds the "Run" button for Java programs in Track A lessons.
 *
 *   npm run lessons:runner             rebuild the modules whose programs changed
 *   npm run lessons:runner -- --force  rebuild everything
 *   npm run lessons:runner -- a3       only module a3
 *
 * Every ```java block in src/content/lessons/a<N>-*.md that is a whole program (a top-level
 * type with `static void main`) is compiled to JavaScript with TeaVM, one bundle per module:
 * src/runner/generated/lessons-a<N>.js. A program gets a Run button only if the browser build
 * prints exactly what the real JVM prints. Each program is first compiled with javac and run
 * twice on the JVM (no input). A program that uses a class defined in an earlier block of the
 * same lesson is compiled together with those blocks. Programs that do not compile, run longer than 10 s, or print
 * different output on the two runs (random numbers, identity hash codes, timing) keep their
 * written output instead, and so do programs TeaVM cannot compile or whose browser output
 * differs (for example HashMap iteration order). The reasons are listed in
 * src/runner/generated/lessons-manifest.json under "excluded".
 */
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  RUNTIME_FILES,
  codeHash,
  compileChunk,
  javaBlocks,
  outDir,
  parseRun,
  requireTools,
  rewrite,
  root,
  runtimeDir,
  stopGradle,
  toolDir,
} from './java-runner-lib.mjs'

const lessonDir = path.join(root, 'src/content/lessons')
const manifestPath = path.join(outDir, 'lessons-manifest.json')
const force = process.argv.includes('--force')
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const JVM_TIMEOUT_MS = 10_000
const BUILD_VERSION = '3'

// ---------------------------------------------------------------- reading lessons

const TOP_TYPE = /^(public\s+)?((?:final|abstract|sealed|non-sealed|static)\s+)*(class|record|enum|interface)\s+(\w+)/gm

/** Top-level types of a program: [{ name, isPublic, index }]. */
function topTypes(code) {
  return [...code.matchAll(TOP_TYPE)].map((m) => ({ name: m[4], isPublic: Boolean(m[1]), index: m.index }))
}

/** The program's shape, or null if the block is not a whole program. */
function program(code) {
  const mainAt = code.search(/static\s+void\s+main\s*\(/)
  if (mainAt < 0) return null
  const types = topTypes(code)
  const owner = types.filter((t) => t.index < mainAt).pop()
  if (!owner) return null
  const publicType = types.find((t) => t.isPublic)
  return { mainClass: owner.name, fileName: publicType ? publicType.name : owner.name }
}

const PUBLIC_TYPE = /^public\s+(?=((?:final|abstract|sealed|non-sealed|static)\s+)*(class|record|enum|interface)\s+\w+)/gm

/** A companion block: no package line, no public top-level types (so any file name works). */
const companionSource = (code) => code.replace(/^package\s+[\w.]+\s*;\s*$/m, '').replace(PUBLIC_TYPE, '')

/**
 * Earlier blocks of the same lesson that a program may build on (it uses a class the lesson
 * defined before it). Nearest first; a block is skipped if it declares a type name already
 * taken, so each class has one definition.
 */
function companionsFor(code, earlier) {
  const taken = new Set(topTypes(code).map((t) => t.name))
  const out = []
  for (const block of [...earlier].reverse()) {
    const names = topTypes(block).map((t) => t.name)
    if (names.length === 0 || names.some((n) => taken.has(n))) continue
    names.forEach((n) => taken.add(n))
    out.push({ name: `Companion${out.length + 1}`, code: block })
  }
  return out
}

/** TeaVM version of a lesson program: own package, only the main class public. */
function forTeaVM(code, mainClass, pkg) {
  let src = code.replace(/^package\s+[\w.]+\s*;\s*$/m, '')
  src = src.replace(PUBLIC_TYPE, '')
  src = src.replace(
    new RegExp(`^((?:(?:final|abstract|sealed|non-sealed|static)\\s+)*(?:class|record|enum|interface)\\s+${mainClass}\\b)`, 'm'),
    'public $1',
  )
  return rewrite(src, pkg)
}

function lessonFiles() {
  return readdirSync(lessonDir)
    .filter((f) => /^a\d+-.*\.md$/.test(f))
    .sort()
}

// ---------------------------------------------------------------- running processes

function runProcess(cmd, args, { input = '', cwd, timeout = JVM_TIMEOUT_MS } = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd })
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

// ---------------------------------------------------------------- build

const jdkHome = requireTools()
const javac = path.join(jdkHome, 'bin/javac')
const java = path.join(jdkHome, 'bin/java')
const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { chunks: {}, lessons: {}, excluded: {} }

// Candidates per module.
const modules = {} // chunk -> [{ key, lessonId, title, code, mainClass, fileName, pkg, stdin }]
for (const file of lessonFiles()) {
  const lessonId = file.replace(/\.md$/, '')
  const chunk = `lessons-${lessonId.split('-')[0]}`
  let n = 0
  const earlier = []
  for (const block of javaBlocks(readFileSync(path.join(lessonDir, file), 'utf8'))) {
    const shape = program(block.code)
    earlier.push(block.code)
    if (!shape) continue
    n++
    ;(modules[chunk] ??= []).push({
      key: `${lessonId}#${n}`,
      lessonId,
      title: block.title,
      code: block.code,
      ...shape,
      pkg: `l_${lessonId.replace(/[^a-z0-9]/g, '_')}_${n}`,
      stdin: /\bSystem\.in\b/.test(block.code),
      companions: companionsFor(block.code, earlier.slice(0, -1)),
    })
  }
}

const hashOf = (chunk) => {
  const h = createHash('sha256')
  h.update(BUILD_VERSION)
  h.update(readFileSync(path.join(toolDir, 'build.gradle.kts')))
  for (const f of RUNTIME_FILES) h.update(readFileSync(path.join(runtimeDir, f)))
  for (const p of modules[chunk]) h.update(p.key + '\u0000' + p.code)
  return h.digest('hex').slice(0, 16)
}
const chunkHashes = Object.fromEntries(Object.keys(modules).map((c) => [c, hashOf(c)]))
const todo = Object.keys(modules)
  .sort((a, b) => Number(a.slice(9)) - Number(b.slice(9)))
  .filter(
    (c) =>
      (only.length === 0 || only.some((o) => c === `lessons-${o}` || c === o)) &&
      (force || previous.chunks?.[c] !== chunkHashes[c] || !existsSync(path.join(outDir, `${c}.js`))),
  )
const total = Object.values(modules).reduce((n, list) => n + list.length, 0)
console.log(`${total} lesson program(s) in ${Object.keys(modules).length} module(s); building ${todo.length}.`)

// Start from the previous manifest so modules that are not rebuilt keep their entries.
const lessons = {}
const excluded = {}
for (const [id, entry] of Object.entries(previous.lessons ?? {})) if (!todo.includes(entry.chunk)) lessons[id] = entry
for (const [id, list] of Object.entries(previous.excluded ?? {})) {
  const chunk = `lessons-${id.split('-')[0]}`
  if (!todo.includes(chunk) && modules[chunk]) excluded[id] = list
}
const chunkState = Object.fromEntries(Object.keys(modules).map((c) => [c, todo.includes(c) ? '' : (previous.chunks?.[c] ?? '')]))

const work = mkdtempSync(path.join(os.tmpdir(), 'lesson-runner-'))
const exclude = (p, reason) => (excluded[p.lessonId] ??= []).push({ title: p.title, reason })
try {
  for (const chunk of todo) {
    const candidates = modules[chunk]
    console.log(`- ${chunk}: ${candidates.length} program(s)`)

    // 1. javac, and two JVM runs that must agree.
    const jvm = await pool(candidates, Math.max(2, os.cpus().length - 1), async (p) => {
      const dir = path.join(work, p.pkg)
      mkdirSync(dir, { recursive: true })
      writeFileSync(path.join(dir, `${p.fileName}.java`), p.code)
      let compiled = await runProcess(javac, ['-nowarn', '-d', dir, path.join(dir, `${p.fileName}.java`)], { timeout: 120_000 })
      let usesCompanions = false
      if (compiled.status !== 0 && /cannot find symbol/.test(compiled.stderr) && p.companions.length > 0) {
        // The program builds on classes from earlier in the lesson: compile it with them.
        const files = [path.join(dir, `${p.fileName}.java`)]
        for (const c of p.companions) {
          writeFileSync(path.join(dir, `${c.name}.java`), companionSource(c.code))
          files.push(path.join(dir, `${c.name}.java`))
        }
        compiled = await runProcess(javac, ['-nowarn', '-d', dir, ...files], { timeout: 120_000 })
        usesCompanions = compiled.status === 0
      }
      if (compiled.status !== 0) {
        const error = compiled.stderr.split('\n').find((l) => l.includes('error:')) ?? compiled.stderr.split('\n')[0]
        return { reason: `does not compile with javac 17: ${error.replace(/^.*?error:\s*/, '')}` }
      }
      const first = await runProcess(java, ['-cp', dir, p.mainClass])
      if (first.timedOut) return { reason: 'runs longer than 10 s on the JVM' }
      const second = await runProcess(java, ['-cp', dir, p.mainClass])
      if (second.stdout !== first.stdout || second.status !== first.status) return { reason: 'prints different output on each run' }
      return { run: first, usesCompanions }
    })
    let survivors = []
    candidates.forEach((p, i) =>
      jvm[i].reason ? exclude(p, jvm[i].reason) : survivors.push({ ...p, jvm: jvm[i].run, usesCompanions: jvm[i].usesCompanions }),
    )

    // 2. TeaVM; drop programs it cannot compile and try again.
    let compiled = { ok: false, output: '' }
    for (let attempt = 0; attempt < 8 && survivors.length > 0; attempt++) {
      compiled = compileChunk(
        chunk,
        survivors.map((p) => ({
          key: p.key,
          pkg: p.pkg,
          mainClass: p.mainClass,
          source: forTeaVM(p.code, p.mainClass, p.pkg),
          extraFiles: p.usesCompanions ? p.companions.map((c) => ({ name: c.name, source: rewrite(companionSource(c.code), p.pkg) })) : [],
        })),
        jdkHome,
        { quiet: true },
      )
      if (compiled.ok) break
      const bad = new Set([...compiled.output.matchAll(/\b(l_[a-z0-9_]+)[./]/g)].map((m) => m[1]))
      const failing = survivors.filter((p) => bad.has(p.pkg))
      if (failing.length === 0) {
        process.stderr.write(compiled.output)
        throw new Error(`TeaVM build failed for ${chunk} and no single program could be blamed`)
      }
      for (const p of failing) {
        const why = compiled.output.split('\n').find((l) => l.trim() && !/^\s+at /.test(l) && !l.includes('FAILURE')) ?? ''
        exclude(p, `TeaVM cannot compile it: ${why.trim().slice(0, 160)}`)
      }
      survivors = survivors.filter((p) => !bad.has(p.pkg))
    }
    if (survivors.length > 0 && !compiled.ok) throw new Error(`TeaVM build failed for ${chunk}`)

    // 3. Browser build vs JVM.
    const runnable = []
    if (survivors.length > 0) {
      const { run } = await import(pathToFileURL(path.join(outDir, `${chunk}.js`)).href + `?t=${Date.now()}`)
      for (const p of survivors) {
        const web = parseRun(run(p.key, ''))
        const same = (p.jvm.status === 0) === (web.status === 'ok') && p.jvm.stdout === web.stdout
        if (same) runnable.push(p)
        else {
          const a = p.jvm.stdout.split('\n')
          const b = web.stdout.split('\n')
          const i = a.findIndex((line, k) => line !== b[k])
          const where = i < 0 ? `JVM exit ${p.jvm.status}, browser ${web.status} ${web.stderr.trim().slice(0, 120)}` : `line ${i + 1}: JVM ${JSON.stringify(a[i]?.slice(0, 60))}, browser ${JSON.stringify(b[i]?.slice(0, 60))}`
          exclude(p, `the browser build prints different output from the JVM (${where})`)
        }
      }
    } else {
      rmSync(path.join(outDir, `${chunk}.js`), { force: true })
    }
    for (const p of runnable) {
      ;(lessons[p.lessonId] ??= { chunk, programs: [] }).programs.push({ key: p.key, title: p.title, hash: codeHash(p.code), stdin: p.stdin })
    }
    chunkState[chunk] = chunkHashes[chunk]
    console.log(`  ${runnable.length} runnable, ${candidates.length - runnable.length} keep their written output`)
  }
} finally {
  rmSync(work, { recursive: true, force: true })
  stopGradle()
  const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]))
  writeFileSync(
    manifestPath,
    JSON.stringify({ chunks: sorted(chunkState), lessons: sorted(lessons), excluded: sorted(excluded) }, null, 2) + '\n',
  )
}
const count = Object.values(lessons).reduce((n, l) => n + l.programs.length, 0)
console.log(`${count} of ${total} lesson programs can be run in the browser.`)
