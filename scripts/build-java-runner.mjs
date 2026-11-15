/**
 * Builds the in-browser "Run" support for walkthrough pages.
 *
 *   npm run problems:runner
 *
 * For every page listed in `src/content/problem-pages/run-samples.json`, each ```java block
 * that is a whole program (`public class Main` with `main`) is compiled to JavaScript with
 * TeaVM (tools/java-runner, needs Gradle and a JDK 17+), so the page can run it on any input
 * without a server. Output:
 *
 *   src/runner/generated/java-programs.js   one ES module exporting run(key, input)
 *   src/runner/generated/manifest.json      page id -> [{ key, title, hash }]
 *
 * TeaVM has no System.setIn and no java.util.Scanner, so each program's source is rewritten
 * before compiling: System.in/out/err/exit point at runner.Io, and Scanner at runner.Scanner.
 * To show the rewrite changes nothing a reader can see, the script then runs every program on
 * every sample and extra input twice, on the real JVM (the page's code, unmodified) and in
 * the TeaVM build, and fails unless standard output and success/failure are identical.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pageDir = path.join(root, 'src/content/problem-pages')
const toolDir = path.join(root, 'tools/java-runner')
const genSrc = path.join(toolDir, 'build/programs')
const outDir = path.join(root, 'src/runner/generated')

/** A JDK 17+ home (TeaVM 0.14 runs on it; the compiled classes target 17). */
function findJdkHome() {
  const candidates = [process.env.JAVA_HOME, '/opt/homebrew/opt/openjdk@17', '/opt/homebrew/opt/openjdk@21', '/opt/homebrew/opt/openjdk']
  try {
    candidates.push(execFileSync('/usr/libexec/java_home', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim())
  } catch {
    // no system JDK registered
  }
  return candidates.find((home) => home && existsSync(path.join(home, 'bin/javac'))) ?? null
}

/** Same normalisation as src/runner/manifest.ts, so the page can detect stale builds. */
export function codeHash(code) {
  const text = code
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .trim()
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}

function javaBlocks(markdown) {
  const blocks = []
  let open = null
  for (const line of markdown.split('\n')) {
    if (open) {
      if (/^\s*```\s*$/.test(line)) {
        blocks.push(open)
        open = null
      } else open.code += line + '\n'
      continue
    }
    const fence = line.match(/^\s*```java\b(.*)$/)
    if (fence) open = { title: fence[1].match(/title="([^"]*)"/)?.[1] ?? '', code: '' }
  }
  return blocks
}

const isProgram = (code) => /^public\s+(final\s+)?class\s+Main\b/m.test(code) && /static\s+void\s+main\s*\(/.test(code)

/** The page's program, moved into its own package and pointed at runner.Io / runner.Scanner. */
function rewrite(code, pkg) {
  for (const banned of ['System.setIn', 'System.setOut', 'System.setErr', 'System.console', 'Runtime.getRuntime']) {
    if (code.includes(banned)) throw new Error(`${pkg}: ${banned} is not supported in the browser runner`)
  }
  let src = code
    .replace(/\bSystem\.in\b/g, 'runner.Io.in')
    .replace(/\bSystem\.out\b/g, 'runner.Io.out')
    .replace(/\bSystem\.err\b/g, 'runner.Io.err')
    .replace(/\bSystem\.exit\s*\(/g, 'runner.Io.exit(')
    .replace(/^import\s+java\.util\.Scanner\s*;/m, 'import runner.Scanner;')
  // A single-type import wins over `import java.util.*;`, so Scanner never resolves to java.util.
  if (/\bScanner\b/.test(src) && !/^import\s+runner\.Scanner\s*;/m.test(src)) src = 'import runner.Scanner;\n' + src
  return `package ${pkg};\n\n${src}`
}

const jdkHome = findJdkHome()
if (!jdkHome) {
  console.error('No JDK 17+ found. Install one (brew install openjdk@17) or set JAVA_HOME.')
  process.exit(2)
}
if (spawnSync('gradle', ['--version'], { stdio: 'ignore' }).status !== 0) {
  console.error('Gradle not found on PATH (brew install gradle).')
  process.exit(2)
}

const config = JSON.parse(readFileSync(path.join(pageDir, 'run-samples.json'), 'utf8'))
rmSync(genSrc, { recursive: true, force: true })
mkdirSync(path.join(genSrc, 'runner'), { recursive: true })

const programs = [] // { key, pageId, title, code, pkg }
const manifest = {}
for (const pageId of Object.keys(config).sort()) {
  const file = path.join(pageDir, `${pageId}.md`)
  if (!existsSync(file)) throw new Error(`run-samples.json lists ${pageId}, but ${pageId}.md does not exist`)
  const found = javaBlocks(readFileSync(file, 'utf8')).filter((b) => isProgram(b.code))
  if (found.length === 0) throw new Error(`${pageId}: no whole Java program (public class Main) to run`)
  manifest[pageId] = []
  found.forEach((block, i) => {
    const key = `${pageId}#${i + 1}`
    const pkg = `p_${pageId.replace(/[^a-z0-9]/g, '_')}_${i + 1}`
    mkdirSync(path.join(genSrc, pkg), { recursive: true })
    writeFileSync(path.join(genSrc, pkg, 'Main.java'), rewrite(block.code, pkg))
    programs.push({ key, pageId, title: block.title, code: block.code, pkg })
    manifest[pageId].push({ key, title: block.title, hash: codeHash(block.code) })
  })
}

const cases = programs.map((p) => `            case "${p.key}": ${p.pkg}.Main.main(new String[0]); return true;`).join('\n')
writeFileSync(
  path.join(genSrc, 'runner/Programs.java'),
  `package runner;

/** Generated by scripts/build-java-runner.mjs. */
final class Programs {
    private Programs() {}

    static boolean run(String key) throws Exception {
        switch (key) {
${cases}
            default: return false;
        }
    }
}
`,
)

console.log(`Compiling ${programs.length} program(s) from ${Object.keys(manifest).length} page(s) with TeaVM…`)
const gradle = spawnSync('gradle', ['generateJavaScript', '--no-daemon', '-q'], {
  cwd: toolDir,
  env: { ...process.env, JAVA_HOME: jdkHome },
  stdio: 'inherit',
})
if (gradle.status !== 0) process.exit(1)

mkdirSync(outDir, { recursive: true })
const built = path.join(toolDir, 'build/generated/teavm/js/java-runner.js')
if (!existsSync(built)) throw new Error(`TeaVM output not found at ${built}`)
const bundle = path.join(outDir, 'java-programs.js')
copyFileSync(built, bundle)
writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')

// Equivalence check: real JVM (unmodified page code) vs the TeaVM build.
const { run } = await import(pathToFileURL(bundle).href + `?t=${Date.now()}`)
const work = mkdtempSync(path.join(os.tmpdir(), 'java-runner-'))
let failures = 0
let checked = 0
try {
  for (const p of programs) {
    const dir = path.join(work, p.pkg)
    mkdirSync(dir)
    writeFileSync(path.join(dir, 'Main.java'), p.code)
    execFileSync(path.join(jdkHome, 'bin/javac'), ['-d', dir, path.join(dir, 'Main.java')], { stdio: 'inherit' })
    const { samples = [], extraInputs = [] } = config[p.pageId]
    for (const input of [...samples.map((s) => s.input), ...extraInputs]) {
      const jvm = spawnSync(path.join(jdkHome, 'bin/java'), ['-cp', dir, 'Main'], { input, maxBuffer: 1 << 28 })
      const [status, stdout] = run(p.key, input).split('\u0000')
      const jvmOk = jvm.status === 0
      const webOk = status === 'ok'
      checked++
      if (jvmOk !== webOk || jvm.stdout.toString() !== stdout) {
        failures++
        console.error(`MISMATCH ${p.key} (${p.title}) on input ${JSON.stringify(input.slice(0, 60))}`)
        console.error(`  JVM   [${jvm.status}] ${JSON.stringify(jvm.stdout.toString().slice(0, 200))}`)
        console.error(`  TeaVM [${status}] ${JSON.stringify(stdout.slice(0, 200))}`)
      }
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}
if (failures) {
  console.error(`${failures} of ${checked} runs differ between the JVM and the browser build.`)
  process.exit(1)
}
console.log(`Browser build matches the JVM on all ${checked} runs. Wrote ${path.relative(root, bundle)} and manifest.json.`)
