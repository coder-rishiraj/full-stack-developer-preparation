/**
 * Builds the in-browser "Run" support for walkthrough pages.
 *
 *   npm run problems:runner            rebuild what changed
 *   npm run problems:runner -- --force rebuild and re-check everything
 *
 * Every page listed in `src/content/problem-pages/run-samples.json` gets a Run panel under each
 * of its runnable Java blocks. Three kinds of page are supported:
 *
 *   - CSES (stdin): each whole program (`public class Main`) runs as it is, reading stdin.
 *   - LeetCode method: the block's `class Solution` is called through a generated `Main` that
 *     reads one LeetCode-style value per parameter ("nums = [2,7,11,15]", "target = 9") and
 *     prints the return value (or, for a void method, the array it changed).
 *   - LeetCode design: a class such as `MinStack` is driven by LeetCode's two-line operation
 *     format (["MinStack","push",...] then [[],[-2],...]) and prints the list of results.
 *   A page that needs judge-provided types (GuessGame, MountainArray) or a special call
 *   supplies `src/content/problem-pages/run/<id>.java` with a `Harness` class instead.
 *
 * The programs are compiled to JavaScript with TeaVM (tools/java-runner; needs Gradle and a
 * JDK 17+), one bundle per problem category: src/runner/generated/<category>.js. TeaVM has no
 * System.setIn and no java.util.Scanner, so sources are rewritten to use runner.Io and
 * runner.Scanner. To show this changes nothing a reader can see, every program is also run
 * on the real JVM on every sample and extra input, and the build fails unless standard output
 * and success/failure match exactly.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  RUNTIME_FILES,
  classBody,
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

const pageDir = path.join(root, 'src/content/problem-pages')
const harnessDir = path.join(pageDir, 'run')
const force = process.argv.includes('--force')
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))

// ---------------------------------------------------------------- environment


// ---------------------------------------------------------------- page parsing



const isStdinProgram = (code) => /^public\s+(final\s+)?class\s+Main\b/m.test(code) && /static\s+void\s+main\s*\(/.test(code)
const declares = (code, name) => new RegExp(`^(public\\s+)?(final\\s+)?class\\s+${name}\\b`, 'm').test(code)

/** Problem id -> category, from the problem lists (the bundle a page's programs go into). */
function categories() {
  const map = {}
  for (const file of ['neetcode250.ts', 'cses.ts']) {
    const src = readFileSync(path.join(root, 'src/content/problems', file), 'utf8')
    for (const m of src.matchAll(/id:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"/g)) map[m[1]] = m[2]
  }
  return map
}

/** Splits "int[] nums, int target" at top-level commas (generic types contain commas). */
function splitParams(text) {
  const out = []
  let depth = 0
  let cur = ''
  for (const ch of text) {
    if (ch === '<') depth++
    if (ch === '>') depth--
    if (ch === ',' && depth === 0) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  if (cur.trim()) out.push(cur)
  return out.map((p) => {
    const m = p.trim().replace(/^final\s+/, '').match(/^(.+?)\s+(\w+)$/)
    if (!m) throw new Error(`cannot read parameter "${p.trim()}"`)
    return { type: m[1].replace(/\s+/g, ''), name: m[2] }
  })
}


/** Public members of a class, read from its 4-space-indented declarations. */
function members(code, name) {
  const body = classBody(code, name)
  const methods = []
  const ctors = []
  for (const m of body.matchAll(/^ {4}public\s+(static\s+)?(?:final\s+)?([\w<>[\], ?]+?)\s+(\w+)\s*\(([^)]*)\)/gm)) {
    methods.push({ isStatic: Boolean(m[1]), ret: m[2].replace(/\s+/g, ''), name: m[3], params: splitParams(m[4]) })
  }
  for (const m of body.matchAll(new RegExp(`^ {4}(?:public\\s+)?${name}\\s*\\(([^)]*)\\)\\s*\\{`, 'gm'))) ctors.push({ params: splitParams(m[1]) })
  return { methods: methods.filter((m) => !(m.isStatic && m.name === 'main')), ctors }
}

// ---------------------------------------------------------------- code generation

const CONVERT = {
  int: 'toInt',
  long: 'toLong',
  double: 'toDouble',
  boolean: 'toBoolean',
  char: 'toChar',
  String: 'toStr',
  Integer: 'toInteger',
  'int[]': 'toIntArray',
  'long[]': 'toLongArray',
  'double[]': 'toDoubleArray',
  'boolean[]': 'toBooleanArray',
  'char[]': 'toCharArray',
  'String[]': 'toStrArray',
  'int[][]': 'toIntArray2',
  'char[][]': 'toCharArray2',
  'String[][]': 'toStrArray2',
  'List<Integer>': 'toIntList',
  'List<String>': 'toStrList',
  'List<List<Integer>>': 'toIntListList',
  'List<List<String>>': 'toStrListList',
}

function convert(param, source, where) {
  const fn = CONVERT[param.type]
  if (!fn) throw new Error(`${where}: parameter type ${param.type} is not supported; add a run/<id>.java harness`)
  return `runner.In.${fn}(${source})`
}

const javaType = (t) => t.replace(/\bList</g, 'java.util.List<')
const quoteJava = (s) => JSON.stringify(s)

function methodMain(cls, method, show, where) {
  const lines = method.params.map(
    (p, i) => `        ${javaType(p.type)} ${p.name} = ${convert(p, `runner.In.arg(in, ${i}, ${quoteJava(p.name)})`, where)};`,
  )
  const call = `${method.isStatic ? cls : `new ${cls}()`}.${method.name}(${method.params.map((p) => p.name).join(', ')})`
  const isArrayLike = (p) => p.type.endsWith('[]') || p.type.startsWith('List<')
  let mode = show ?? (method.ret === 'void' ? `arg:${method.params.find(isArrayLike)?.name}` : 'return')
  if (mode === 'return') {
    if (method.ret === 'void') throw new Error(`${where}: ${method.name} returns nothing; set "show" to arg:<name>`)
    lines.push(`        ${javaType(method.ret)} result = ${call};`, `        System.out.println(runner.Show.of(result));`)
  } else if (mode.startsWith('arg:')) {
    const names = mode.slice(4).split(',')
    if (names.some((n) => !method.params.some((p) => p.name === n))) throw new Error(`${where}: show "${mode}" names no parameter`)
    lines.push(`        ${method.ret === 'void' ? '' : 'Object result = '}${call};`)
    for (const n of names) lines.push(`        System.out.println(${quoteJava(n + ' = ')} + runner.Show.of(${n}));`)
  } else if (mode.startsWith('k-prefix:')) {
    const n = mode.slice(9)
    lines.push(
      `        int k = ${call};`,
      `        System.out.println("k = " + k);`,
      `        System.out.println(${quoteJava(n + ' = ')} + runner.Show.of(java.util.Arrays.copyOf(${n}, Math.max(0, Math.min(k, ${n}.length)))));`,
    )
  } else throw new Error(`${where}: unknown show mode "${mode}"`)
  return wrapMain(lines)
}

function designMain(cls, { methods, ctors }, where) {
  const names = new Set()
  for (const m of methods) {
    if (names.has(m.name)) throw new Error(`${where}: ${cls}.${m.name} is overloaded; add a run/<id>.java harness`)
    names.add(m.name)
  }
  const ctor = ctors[0] ?? { params: [] }
  const args = (params) => params.map((p, i) => convert(p, `runner.In.arg(a, ${i}, ${quoteJava(p.name)})`, where)).join(', ')
  const cases = [
    `                case ${quoteJava(cls)}: obj = new ${cls}(${args(ctor.params)}); out.append("null"); break;`,
    ...methods.map((m) => {
      const call = `obj.${m.name}(${args(m.params)})`
      return m.ret === 'void'
        ? `                case ${quoteJava(m.name)}: need(obj); ${call}; out.append("null"); break;`
        : `                case ${quoteJava(m.name)}: need(obj); out.append(runner.Show.of(${call})); break;`
    }),
  ]
  return wrapMain(
    [
      `        java.util.List<Object> ops = runner.In.list(runner.In.arg(in, 0, "operations"));`,
      `        java.util.List<Object> argv = in.size() > 1 ? runner.In.list(in.get(1)) : new java.util.ArrayList<Object>();`,
      `        StringBuilder out = new StringBuilder("[");`,
      `        ${cls} obj = null;`,
      `        for (int i = 0; i < ops.size(); i++) {`,
      `            String op = runner.In.toStr(ops.get(i));`,
      `            java.util.List<Object> a = i < argv.size() ? runner.In.list(argv.get(i)) : new java.util.ArrayList<Object>();`,
      `            if (i > 0) out.append(", ");`,
      `            switch (op) {`,
      ...cases,
      `                default: throw new IllegalArgumentException("unknown operation " + op);`,
      `            }`,
      `        }`,
      `        System.out.println(out.append("]"));`,
    ],
    [
      `    private static void need(Object obj) {`,
      `        if (obj == null) throw new IllegalStateException(${quoteJava(`the first operation must be "${cls}"`)});`,
      `    }`,
    ],
  )
}

function wrapMain(body, extra = []) {
  return [
    'public class Main {',
    '    public static void main(String[] args) throws Exception {',
    '        java.util.List<Object> in = runner.In.values(System.in);',
    ...body,
    '    }',
    ...extra,
    '}',
  ].join('\n')
}

/** Joins sources into one compilation unit: imports first, top-level classes not public. */
function combine(parts) {
  const imports = new Set()
  const bodies = parts.map((src) =>
    src
      .split('\n')
      .filter((line) => {
        if (/^import\s+[\w.*]+\s*;\s*$/.test(line)) {
          imports.add(line.trim())
          return false
        }
        return true
      })
      .join('\n')
      .replace(/^public\s+((?:final\s+|abstract\s+)?(?:class|interface|enum|record)\s+(?!Main\b))/gm, '$1'),
  )
  return [...imports, '', ...bodies].join('\n')
}


/** The runnable programs of one page: [{ title, code (page block), source (JVM Main.java) }]. */
function pagePrograms(id, entry) {
  const md = readFileSync(path.join(pageDir, `${id}.md`), 'utf8')
  const blocks = javaBlocks(md).filter((b) => !b.fragment)
  if (id.startsWith('cses-')) {
    const found = blocks.filter((b) => isStdinProgram(b.code))
    if (found.length === 0) throw new Error(`${id}: no whole Java program (public class Main) to run`)
    return found.map((b) => ({ title: b.title, code: b.code, source: b.code, hint: 'Standard input, exactly as the judge sends it.' }))
  }
  const harnessFile = path.join(harnessDir, `${id}.java`)
  const harness = existsSync(harnessFile) ? readFileSync(harnessFile, 'utf8') : null
  const first = blocks[0]?.code ?? ''
  const cls = entry.className ?? (declares(first, 'Solution') ? 'Solution' : first.match(/^(?:public\s+)?(?:final\s+)?class\s+(\w+)/m)?.[1])
  if (!cls) throw new Error(`${id}: cannot tell which class to run`)
  const found = blocks.filter((b) => declares(b.code, cls))
  if (found.length === 0) throw new Error(`${id}: no block declares class ${cls}`)
  return found.map((b) => {
    const where = `${id} (${b.title})`
    let main
    let hint
    if (harness) {
      main = wrapMain(['        Harness.run(in);'])
      hint = harness.match(/^\/\/ Input: (.*?)\.?\s*(?:Prints|$)/m)?.[1] ?? 'LeetCode-style values, one per line.'
      hint = `One value per line, for example ${hint}.`
    } else if (cls === 'Solution') {
      const { methods } = members(b.code, cls)
      const named = entry.method ? methods.filter((m) => m.name === entry.method) : methods
      const distinct = [...new Set(named.map((m) => m.name))]
      if (distinct.length !== 1) {
        throw new Error(`${where}: found public methods [${methods.map((m) => m.name)}]; set "method" in run-samples.json`)
      }
      main = methodMain(cls, named[0], entry.show, where)
      const sig = named[0].params.map((p) => `${p.type} ${p.name}`).join(', ')
      hint = `One value per parameter of ${named[0].name}(${sig}), LeetCode style: name = value.`
    } else {
      main = designMain(cls, members(b.code, cls), where)
      hint = `Line 1: the ${cls} operations to call. Line 2: their arguments, LeetCode style.`
    }
    return { title: b.title, code: b.code, hint, source: combine(harness ? [b.code, harness, main] : [b.code, main]) }
  })
}


/**
 * Output in a form where only differences the page cares about remain. Pages whose answer
 * may come in any order (the order of a HashMap's entries differs between the JVM and the
 * browser build) compare with their lists sorted: the top level, or every level.
 */
function canonical(stdout, mode) {
  if (mode !== 'unordered' && mode !== 'unordered-nested') return stdout
  const sortDeep = (v, depth) => {
    if (!Array.isArray(v)) return v
    const items = v.map((x) => (mode === 'unordered-nested' ? sortDeep(x, depth + 1) : x))
    return depth === 0 || mode === 'unordered-nested' ? items.map((x) => JSON.stringify(x)).sort() : items
  }
  return stdout
    .split('\n')
    .map((line) => {
      const m = line.match(/^(\w+ = )?(.*)$/)
      try {
        return (m[1] ?? '') + JSON.stringify(sortDeep(JSON.parse(m[2]), 0))
      } catch {
        return line
      }
    })
    .join('\n')
}

// ---------------------------------------------------------------- build

const jdkHome = requireTools()

const config = JSON.parse(readFileSync(path.join(pageDir, 'run-samples.json'), 'utf8'))
const category = categories()
const manifestPath = path.join(outDir, 'manifest.json')
const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { pages: {}, chunks: {} }

// Group programs by chunk (problem category).
const chunks = {} // chunk -> [{ key, pageId, title, code, source, pkg }]
const pages = {}
let problems = 0
for (const id of Object.keys(config).sort()) {
  if (!existsSync(path.join(pageDir, `${id}.md`))) throw new Error(`run-samples.json lists ${id}, but ${id}.md does not exist`)
  const chunk = category[id]
  if (!chunk) throw new Error(`${id}: not found in src/content/problems`)
  const programs = pagePrograms(id, config[id])
  pages[id] = { chunk, format: id.startsWith('cses-') ? 'stdin' : 'leetcode', hint: programs[0].hint, programs: [] }
  programs.forEach((p, i) => {
    const key = `${id}#${i + 1}`
    const pkg = `p_${id.replace(/[^a-z0-9]/g, '_')}_${i + 1}`
    ;(chunks[chunk] ??= []).push({ ...p, key, pageId: id, pkg })
    pages[id].programs.push({ key, title: p.title, hash: codeHash(p.code) })
    problems++
  })
}

const chunkHashes = {}
for (const [chunk, programs] of Object.entries(chunks)) {
  const h = createHash('sha256')
  h.update(readFileSync(path.join(toolDir, 'build.gradle.kts')))
  for (const f of RUNTIME_FILES) h.update(readFileSync(path.join(runtimeDir, f)))
  for (const p of programs) {
    h.update(p.key)
    h.update(p.source)
    h.update(JSON.stringify(config[p.pageId]))
  }
  chunkHashes[chunk] = h.digest('hex').slice(0, 16)
}

const todo = Object.keys(chunks).filter(
  (c) =>
    (only.length === 0 || only.includes(c) || chunks[c].some((p) => only.includes(p.pageId))) &&
    (force || previous.chunks?.[c] !== chunkHashes[c] || !existsSync(path.join(outDir, `${c}.js`))),
)
console.log(`${problems} program(s) on ${Object.keys(pages).length} page(s) in ${Object.keys(chunks).length} bundle(s); building ${todo.length}.`)

mkdirSync(outDir, { recursive: true })
const work = mkdtempSync(path.join(os.tmpdir(), 'java-runner-'))
let failures = 0
let checked = 0
try {
  // Runtime classes for the JVM side of the comparison.
  const jvmRuntime = path.join(work, 'runtime')
  execFileSync(path.join(jdkHome, 'bin/javac'), ['-d', jvmRuntime, path.join(runtimeDir, 'In.java'), path.join(runtimeDir, 'Show.java')], { stdio: 'inherit' })

  for (const chunk of todo) {
    const programs = chunks[chunk]
    console.log(`- ${chunk}: compiling ${programs.length} program(s) with TeaVM…`)
    const compiled = compileChunk(
      chunk,
      programs.map((p) => ({ key: p.key, pkg: p.pkg, mainClass: 'Main', source: rewrite(p.source, p.pkg) })),
      jdkHome,
    )
    if (!compiled.ok) throw new Error(`TeaVM build failed for ${chunk}`)
    const bundle = path.join(outDir, `${chunk}.js`)

    // Equivalence check: real JVM vs the TeaVM build, on every sample and extra input.
    const { run } = await import(pathToFileURL(bundle).href + `?t=${Date.now()}`)
    for (const p of programs) {
      const dir = path.join(work, p.pkg)
      mkdirSync(dir)
      writeFileSync(path.join(dir, 'Main.java'), p.source)
      execFileSync(path.join(jdkHome, 'bin/javac'), ['-nowarn', '-cp', jvmRuntime, '-d', dir, path.join(dir, 'Main.java')], { stdio: 'inherit' })
      const { samples = [], extraInputs = [] } = config[p.pageId]
      for (const input of [...samples.map((s) => s.input), ...extraInputs]) {
        const jvm = spawnSync(path.join(jdkHome, 'bin/java'), ['-cp', `${dir}${path.delimiter}${jvmRuntime}`, 'Main'], { input, maxBuffer: 1 << 28 })
        const { status, stdout } = parseRun(run(p.key, input))
        checked++
        const mode = config[p.pageId].check
        if ((jvm.status === 0) !== (status === 'ok') || canonical(jvm.stdout.toString(), mode) !== canonical(stdout, mode)) {
          failures++
          console.error(`  MISMATCH ${p.key} (${p.title}) on input ${JSON.stringify(input.slice(0, 80))}`)
          console.error(`    JVM   [${jvm.status}] ${JSON.stringify(jvm.stdout.toString().slice(0, 200))} ${jvm.stderr.toString().slice(0, 300)}`)
          console.error(`    TeaVM [${status}] ${JSON.stringify(stdout.slice(0, 200))}`)
        }
      }
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true })
  stopGradle()
}

// Drop bundles of chunks that no longer exist.
for (const old of Object.keys(previous.chunks ?? {})) {
  if (!chunks[old]) rmSync(path.join(outDir, `${old}.js`), { force: true })
}
const builtOk = failures === 0
const chunkState = Object.fromEntries(
  Object.keys(chunks)
    .sort()
    .map((c) => [c, todo.includes(c) && !builtOk ? (previous.chunks?.[c] ?? '') : chunkHashes[c]]),
)
writeFileSync(manifestPath, JSON.stringify({ chunks: chunkState, pages }, null, 2) + '\n')
if (!builtOk) {
  console.error(`${failures} of ${checked} runs differ between the JVM and the browser build.`)
  process.exit(1)
}
console.log(todo.length ? `Browser build matches the JVM on all ${checked} runs in the rebuilt bundle(s).` : 'Every bundle is current; nothing to rebuild.')
