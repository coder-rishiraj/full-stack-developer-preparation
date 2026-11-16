/**
 * Imports CSES's official test data for the Check button on CSES problem pages.
 *
 *   npm run tests:cses                 every section
 *   npm run tests:cses -- 001 007      only these sections (by number)
 *
 * Source: the CSES Problem Set test data as published by cses.fi (each problem's tests can be
 * downloaded there when logged in), via the archive.org mirror "oi-ted-cses-archive"
 * (one .tar.xz per section). Credit: cses.fi.
 *
 * Writes public/tests/cses/<problem-id>.json with up to MAX_TESTS of the problem's smallest
 * tests (input and output each at most MAX_BYTES), so pages stay fast; `total` says how many
 * official tests exist. Also reads each problem's statement on cses.fi to note problems that
 * accept any valid answer (the expected output is then one correct answer, not the only one)
 * and interactive problems (which cannot be checked with fixed files).
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { root } from './java-runner-lib.mjs'

const MAX_TESTS = 12
const MAX_BYTES = 24 * 1024
const FALLBACK_BYTES = 600 * 1024
const ARCHIVE = 'https://archive.org/download/oi-ted-cses-archive/CSES%20Problem%20Set%20(400%20Problems)/testdata/'
const SECTIONS = [
  '001_Introductory_Problems', '002_Sorting_and_Searching', '003_Dynamic_Programming', '004_Graph_Algorithms',
  '005_Range_Queries', '006_Tree_Algorithms', '007_Mathematics', '008_String_Algorithms', '009_Geometry',
  '010_Advanced_Techniques', '011_Sliding_Window_Problems', '012_Interactive_Problems', '013_Bitwise_Operations',
  '014_Construction_Problems', '015_Advanced_Graph_Problems', '016_Counting_Problems', '017_Additional_Problems_I',
  '018_Additional_Problems_II',
]
const only = process.argv.slice(2)
const outDir = path.join(root, 'public/tests/cses')
const cacheDir = path.join(root, 'node_modules/.cache/cses-tests')
mkdirSync(outDir, { recursive: true })
mkdirSync(cacheDir, { recursive: true })

// Accents removed first: "Prüfer" may be stored decomposed (u + accent) in folder names.
const norm = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '')

// Our CSES problems: id, name, task number.
const problems = new Map()
const list = readFileSync(path.join(root, 'src/content/problems/cses.ts'), 'utf8')
for (const m of list.matchAll(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)",[\s\S]*?sourceId:\s*"([^"]+)"/g)) {
  problems.set(norm(m[2]), { id: m[1], name: m[2], task: m[3] })
}

/** Statement flags from cses.fi (cached in node_modules/.cache). */
async function statementFlags(task) {
  const file = path.join(cacheDir, `task-${task}.html`)
  let html
  if (existsSync(file)) html = readFileSync(file, 'utf8')
  else {
    html = ''
    for (let attempt = 0; attempt < 5 && !html; attempt++) {
      try {
        const res = await fetch(`https://cses.fi/problemset/task/${task}`)
        if (res.ok) html = await res.text()
      } catch {
        // cses.fi closed the connection; wait and try again
      }
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
    }
    if (!html) return { anyAnswer: false, interactive: false, timeLimit: null, statementUnread: true }
    writeFileSync(file, html)
  }
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  return {
    anyAnswer: /\bany (of them|valid|solution|such|one of them|optimal)\b|several (solutions|answers)|multiple (solutions|answers)|\b(print|output|give|construct) (an example|any|a valid|one possible|one such)\b/i.test(text),
    interactive: /interactive/i.test(text),
    timeLimit: text.match(/Time limit:\s*([\d.]+ s)/)?.[1] ?? null,
  }
}

const summary = { problems: 0, tests: 0, unmatched: [] }
for (const section of SECTIONS) {
  if (only.length && !only.some((o) => section.startsWith(o))) continue
  const archive = path.join(cacheDir, `${section}.tar.xz`)
  if (!existsSync(archive)) {
    console.log(`Downloading ${section}…`)
    execFileSync('curl', ['-sfL', '-o', archive, `${ARCHIVE}${section}.tar.xz`], { stdio: 'inherit' })
  }
  const work = mkdtempSync(path.join(os.tmpdir(), 'cses-'))
  try {
    execFileSync('tar', ['-xJf', archive, '-C', work])
    for (const dir of readdirSync(work).sort()) {
      const full = path.join(work, dir)
      if (!statSync(full).isDirectory()) continue
      const problem = problems.get(norm(dir.replace(/^\d+_/, '')))
      if (!problem) {
        summary.unmatched.push(`${section}/${dir}`)
        continue
      }
      const names = [...new Set(readdirSync(full).filter((f) => f.endsWith('.in')).map((f) => f.slice(0, -3)))]
      const all = names
        .filter((n) => existsSync(path.join(full, `${n}.out`)))
        .map((n) => ({ name: n, inBytes: statSync(path.join(full, `${n}.in`)).size, outBytes: statSync(path.join(full, `${n}.out`)).size }))
      const bySize = [...all].sort((a, b) => a.inBytes + a.outBytes - (b.inBytes + b.outBytes))
      let chosen = bySize.filter((t) => t.inBytes <= MAX_BYTES && t.outBytes <= MAX_BYTES).slice(0, MAX_TESTS)
      // Every test is large: keep the smallest one if it is still reasonable to load.
      if (chosen.length === 0 && bySize[0] && bySize[0].inBytes + bySize[0].outBytes <= FALLBACK_BYTES) chosen = [bySize[0]]
      chosen.sort((a, b) => Number(a.name) - Number(b.name) || a.name.localeCompare(b.name))
      const flags = await statementFlags(problem.task)
      const tests = chosen.map((t) => ({
        name: `Test ${t.name}`,
        input: readFileSync(path.join(full, `${t.name}.in`), 'utf8'),
        output: readFileSync(path.join(full, `${t.name}.out`), 'utf8'),
      }))
      writeFileSync(
        path.join(outDir, `${problem.id}.json`),
        JSON.stringify({ problemId: problem.id, source: 'cses', credit: 'Official CSES test data (cses.fi)', total: all.length, ...flags, tests }) + '\n',
      )
      summary.problems++
      summary.tests += tests.length
    }
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
}
console.log(`Wrote tests for ${summary.problems} CSES problems (${summary.tests} tests).`)
if (summary.unmatched.length) console.log(`No matching problem for: ${summary.unmatched.join(', ')}`)
