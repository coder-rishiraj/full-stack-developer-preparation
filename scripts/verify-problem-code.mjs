/**
 * Compiles and tests the Java on every problem walkthrough page.
 *
 *   npm run problems:verify                 all pages
 *   npm run problems:verify -- nc-two-sum   only the named pages
 *
 * For each `src/content/problem-pages/<id>.md`:
 *   - every ```java block that declares a top-level class (`class Solution`, or the
 *     problem's own class such as `class MyHashSet`) is compiled on its own (warnings
 *     are errors) together with `tests/<id>.java`, then `Tests.main` runs;
 *   - every "### Approach N" must contain such a block;
 *   - other ```java blocks (skeletons, fragments) are compiled inside a wrapper
 *     method when the page marks them `fragment="<signature>"`, otherwise listed.
 *
 * `tests/<id>.java` declares `class Tests` with a `main` that throws on failure. It may
 * also declare helper types the judge normally provides (ListNode, TreeNode, …).
 * Needs a JDK: JAVA_HOME, `/usr/libexec/java_home`, Homebrew's openjdk, or javac on PATH.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pageDir = path.join(root, 'src/content/problem-pages')
const testDir = path.join(pageDir, 'tests')

function findJdk() {
  const candidates = []
  if (process.env.JAVA_HOME) candidates.push(process.env.JAVA_HOME)
  try {
    candidates.push(execFileSync('/usr/libexec/java_home', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim())
  } catch {
    // no system JDK registered
  }
  candidates.push('/opt/homebrew/opt/openjdk', '/usr/local/opt/openjdk', '/opt/homebrew/opt/openjdk@21', '/opt/homebrew/opt/openjdk@17')
  for (const home of candidates) {
    if (home && existsSync(path.join(home, 'bin/javac'))) return path.join(home, 'bin')
  }
  // Last resort: javac on PATH (on macOS /usr/bin/javac is a stub that fails without a JDK).
  if (spawnSync('javac', ['-version'], { stdio: 'ignore' }).status === 0) return ''
  return null
}

const bin = findJdk()
if (bin === null) {
  console.error('No JDK found. Install one (for example `brew install openjdk`) or set JAVA_HOME, then run again.')
  process.exit(2)
}
const javac = bin ? path.join(bin, 'javac') : 'javac'
const java = bin ? path.join(bin, 'java') : 'java'

/** Every fenced ```java block with its title, attributes and the nearest "### " heading above it. */
function javaBlocks(markdown) {
  const blocks = []
  let heading = ''
  let open = null
  for (const line of markdown.split('\n')) {
    if (open) {
      if (/^\s*```\s*$/.test(line)) {
        blocks.push(open)
        open = null
      } else open.code += line + '\n'
      continue
    }
    const h = line.match(/^###\s+(.*?)\s*$/)
    if (h) heading = h[1]
    const fence = line.match(/^\s*```java\b(.*)$/)
    if (fence) {
      open = {
        heading,
        title: fence[1].match(/title="([^"]*)"/)?.[1] ?? '(untitled)',
        fragment: fence[1].match(/fragment="([^"]*)"/)?.[1],
        code: '',
      }
    }
  }
  return blocks
}

function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout: 120_000 })
  return { ok: res.status === 0, out: `${res.stdout ?? ''}${res.stderr ?? ''}`.trim() || (res.error ? String(res.error) : '') }
}

/** A block is a complete program unit when it declares a class at the top level. */
const COMPLETE = /^(public\s+)?(final\s+)?class\s+\w+/m
const COMPLETE_NAME = /^(public\s+)?(final\s+)?class\s+(\w+)/m

const wanted = process.argv.slice(2)
const ids = readdirSync(pageDir)
  .filter((f) => f.endsWith('.md') && f !== 'PROGRESS.md')
  .map((f) => f.slice(0, -3))
  .filter((id) => wanted.length === 0 || wanted.includes(id))
  .sort()
for (const id of wanted) {
  if (!ids.includes(id)) {
    console.error(`No page named ${id}.md in src/content/problem-pages`)
    process.exit(2)
  }
}

const work = mkdtempSync(path.join(os.tmpdir(), 'problem-code-'))
let failures = 0
const fail = (msg) => {
  failures++
  console.error(`  ✗ ${msg}`)
}

try {
  for (const id of ids) {
    console.log(id)
    const markdown = readFileSync(path.join(pageDir, `${id}.md`), 'utf8')
    const blocks = javaBlocks(markdown)
    const testFile = path.join(testDir, `${id}.java`)
    if (!existsSync(testFile)) {
      fail(`missing tests/${id}.java — every page needs a test file that exercises its solutions`)
      continue
    }
    const tests = readFileSync(testFile, 'utf8')

    const approaches = [...markdown.matchAll(/^###\s+(Approach \d.*?)\s*$/gm)].map((m) => m[1])
    for (const name of approaches) {
      if (!blocks.some((b) => b.heading === name && COMPLETE.test(b.code))) {
        fail(`"${name}" has no java block declaring a top-level class`)
      }
    }

    blocks.forEach((block, index) => {
      const dir = path.join(work, `${id}-${index}`)
      mkdirSync(dir, { recursive: true })
      const complete = COMPLETE.test(block.code)
      if (!complete && !block.fragment) {
        console.log(`  – not compiled (fragment without fragment="…"): ${block.title}`)
        return
      }
      // A fragment that ends in `return` must not get a trailing throw ("unreachable statement").
      const endsInReturn = /^\s*return\b[^;]*;\s*$/.test(block.code.trim().split('\n').pop() ?? '')
      const tail = endsInReturn ? '' : '\n        throw new IllegalArgumentException("no answer");'
      const source = complete
        ? block.code
        : `import java.util.*;\n\nclass Solution {\n    ${block.fragment} {\n${block.code}${tail}\n    }\n}\n`
      // Name the file after its first top-level class (MyHashSet.java, …) so javac does not warn.
      const className = source.match(COMPLETE_NAME)?.[3] ?? 'Solution'
      writeFileSync(path.join(dir, `${className}.java`), source)
      writeFileSync(path.join(dir, 'Tests.java'), tests)
      const compiled = run(javac, ['-Xlint:all', '-Werror', '-d', 'out', `${className}.java`, 'Tests.java'], dir)
      if (!compiled.ok) {
        fail(`does not compile: ${block.title}\n${compiled.out.replace(/^/gm, '      ')}`)
        return
      }
      const ran = run(java, ['-cp', 'out', 'Tests'], dir)
      if (!ran.ok) {
        fail(`tests fail: ${block.title}\n${ran.out.replace(/^/gm, '      ')}`)
        return
      }
      console.log(`  ✓ ${block.title} — ${ran.out.split('\n').pop()}`)
    })
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}

console.log(failures ? `\n${failures} failure(s) in ${ids.length} page(s)` : `\nAll Java on ${ids.length} page(s) compiles and passes its tests`)
process.exit(failures ? 1 : 0)
