/**
 * Shared pieces of the in-browser Java runner builds (scripts/build-java-runner.mjs for
 * problem walkthroughs, scripts/build-lesson-runner.mjs for lessons): finding a JDK,
 * reading ```java fences, rewriting a program for TeaVM, compiling one bundle, and reading
 * a bundle's result.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const toolDir = path.join(root, 'tools/java-runner')
export const runtimeDir = path.join(toolDir, 'src/main/java/runner')
export const chunkSrcRoot = path.join(toolDir, 'build/chunks')
export const outDir = path.join(root, 'src/runner/generated')
export const RUNTIME_FILES = ['Entry.java', 'Io.java', 'Scanner.java', 'In.java', 'Show.java', 'ThreadLocalRandom.java', 'Random.java', '../org/teavm/classlib/java/util/TStringJoiner.java']

export function findJdkHome() {
  const candidates = [process.env.JAVA_HOME, '/opt/homebrew/opt/openjdk@17', '/opt/homebrew/opt/openjdk@21', '/opt/homebrew/opt/openjdk']
  try {
    candidates.push(execFileSync('/usr/libexec/java_home', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim())
  } catch {
    // no system JDK registered
  }
  return candidates.find((home) => home && existsSync(path.join(home, 'bin/javac'))) ?? null
}

/** Same normalisation and FNV-1a hash as src/runner/run-java.ts, so pages detect stale builds. */
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

export function javaBlocks(markdown) {
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
    if (fence) {
      open = { title: fence[1].match(/title="([^"]*)"/)?.[1] ?? '', fragment: /fragment="/.test(fence[1]), code: '' }
    }
  }
  return blocks
}

/** The body of top-level class `name` in `code`. */
export function classBody(code, name) {
  const start = code.search(new RegExp(`^(public\\s+)?(final\\s+)?class\\s+${name}\\b`, 'm'))
  if (start < 0) return ''
  let depth = 0
  for (let i = code.indexOf('{', start); i < code.length; i++) {
    if (code[i] === '{') depth++
    if (code[i] === '}' && --depth === 0) return code.slice(start, i + 1)
  }
  return code.slice(start)
}

/** TeaVM version: own package; System.in/out/err/exit and Scanner point at runner.*. */
export function rewrite(code, pkg) {
  for (const banned of ['System.setIn', 'System.setOut', 'System.setErr', 'System.console', 'Runtime.getRuntime']) {
    if (code.includes(banned)) throw new Error(`${pkg}: ${banned} is not supported in the browser runner`)
  }
  let src = code
    .replace(/\bSystem\.in\b/g, 'runner.Io.in')
    .replace(/\bSystem\.out\b/g, 'runner.Io.out')
    .replace(/\bSystem\.err\b/g, 'runner.Io.err')
    .replace(/\bSystem\.exit\s*\(/g, 'runner.Io.exit(')
    .replace(/^import\s+java\.util\.Scanner\s*;/m, 'import runner.Scanner;')
    .replace(/^import\s+java\.util\.concurrent\.ThreadLocalRandom\s*;/m, 'import runner.ThreadLocalRandom;')
    .replace(/\bjava\.util\.concurrent\.ThreadLocalRandom\b/g, 'runner.ThreadLocalRandom')
    // TeaVM's Formatter has no %n; on the JVMs this targets (macOS, Linux) it is "\n".
    .replace(/"(?:[^"\\\n]|\\.)*"/g, (lit) => lit.replace(/(^|[^%])((?:%%)*)%n/g, '$1$2\\n'))
  if (/\bScanner\b/.test(src) && !/^import\s+runner\.Scanner\s*;/m.test(src)) src = 'import runner.Scanner;\n' + src
  // TeaVM's Random ignores the specified algorithm; runner.Random is the JDK's exact generator.
  src = src.replace(/^import\s+java\.util\.Random\s*;/m, 'import runner.Random;').replace(/\bjava\.util\.Random\b/g, 'runner.Random')
  if (/(?<![\w.])Random\b/.test(src) && !/^import\s+runner\.Random\s*;/m.test(src)) src = 'import runner.Random;\n' + src
  return `package ${pkg};\n\n${src}`
}

/** Splits the bundle's "status NUL n NUL stdout stderr" result (see runner/Entry.java). */
export function parseRun(raw) {
  const a = raw.indexOf('\u0000')
  const b = raw.indexOf('\u0000', a + 1)
  const n = Number(raw.slice(a + 1, b))
  return { status: raw.slice(0, a), stdout: raw.slice(b + 1, b + 1 + n), stderr: raw.slice(b + 1 + n) }
}

/** Stops with a message unless a JDK 17+ and Gradle are available; returns the JDK home. */
export function requireTools() {
  const jdkHome = findJdkHome()
  if (!jdkHome) {
    console.error('No JDK 17+ found. Install one (brew install openjdk@17) or set JAVA_HOME.')
    process.exit(2)
  }
  if (spawnSync('gradle', ['--version'], { stdio: 'ignore' }).status !== 0) {
    console.error('Gradle not found on PATH (brew install gradle).')
    process.exit(2)
  }
  return jdkHome
}

/**
 * Writes one bundle's sources (each program in its own package, plus runner.Programs) and
 * compiles them with TeaVM into src/runner/generated/<chunk>.js. Each program is
 * { key, pkg, mainClass, source, extraFiles? }; sources are already rewritten for TeaVM. Returns
 * { ok, output } where output is TeaVM's console text (for finding failing programs).
 */
export function compileChunk(chunk, programs, jdkHome, { quiet = false } = {}) {
  const srcDir = path.join(chunkSrcRoot, chunk)
  rmSync(srcDir, { recursive: true, force: true })
  mkdirSync(path.join(srcDir, 'runner'), { recursive: true })
  for (const p of programs) {
    mkdirSync(path.join(srcDir, p.pkg))
    writeFileSync(path.join(srcDir, p.pkg, `${p.mainClass}.java`), p.source)
    for (const extra of p.extraFiles ?? []) writeFileSync(path.join(srcDir, p.pkg, `${extra.name}.java`), extra.source)
  }
  const cases = programs.map((p) => `            case "${p.key}": ${p.pkg}.${p.mainClass}.main(new String[0]); return true;`).join('\n')
  writeFileSync(
    path.join(srcDir, 'runner/Programs.java'),
    `package runner;\n\n/** Generated by the Java runner build. */\nfinal class Programs {\n    private Programs() {}\n\n    static boolean run(String key) throws Exception {\n        switch (key) {\n${cases}\n            default: return false;\n        }\n    }\n}\n`,
  )
  const gradle = spawnSync('gradle', ['generateJavaScript', '-q', `-Pchunk=${chunk}`], {
    cwd: toolDir,
    env: { ...process.env, JAVA_HOME: jdkHome },
    encoding: 'utf8',
    maxBuffer: 1 << 26,
  })
  const output = `${gradle.stdout}${gradle.stderr}`
  if (gradle.status !== 0) {
    if (!quiet) process.stderr.write(output)
    return { ok: false, output }
  }
  mkdirSync(outDir, { recursive: true })
  copyFileSync(path.join(toolDir, `build/out/${chunk}/generated/teavm/js/java-runner.js`), path.join(outDir, `${chunk}.js`))
  return { ok: true, output }
}

export function stopGradle() {
  spawnSync('gradle', ['--stop', '-q'], { cwd: toolDir, stdio: 'ignore' })
}

export { execFileSync }
