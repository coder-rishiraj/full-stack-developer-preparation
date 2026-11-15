import { describe, expect, test } from 'vitest'
import { parseProblemPage } from '@/content/problem-pages'
import samplesConfig from '@/content/problem-pages/run-samples.json'
import manifest from '@/runner/generated/manifest.json'
import { check, sameValues } from '@/runner/checkers'
import { parseRun, type BundleModule } from '@/runner/parse-run'
import { codeHash, findRunnable } from '@/runner/run-java'
import type { Sample } from '@/runner/context'

const sources = import.meta.glob<string>(['../content/problem-pages/*.md', '!../content/problem-pages/PROGRESS.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
})
const bundles = import.meta.glob<BundleModule>('../runner/generated/*.js', { eager: true })
const pageIds = Object.keys(sources)
  .map((p) => p.split('/').pop()!.replace(/\.md$/, ''))
  .sort()

const config = samplesConfig as Record<string, { samples: Sample[] }>
type BuiltPage = { chunk: string; programs: { key: string; title: string; hash: string }[] }
const built = (manifest as unknown as { pages: Record<string, BuiltPage> }).pages

describe('in-browser Java runner', () => {
  test('every walkthrough page can be run: it has samples in run-samples.json and a build', () => {
    expect(pageIds.filter((id) => !config[id]), 'add these pages to run-samples.json, then npm run problems:runner').toEqual([])
    expect(Object.keys(built).sort()).toEqual(Object.keys(config).sort())
  })

  for (const id of pageIds) {
    if (!built[id] || !config[id]) continue

    test(`${id}: the build is current (run \`npm run problems:runner\` after editing the code)`, () => {
      const blocks = parseProblemPage(sources[`../content/problem-pages/${id}.md`]).doc.blocks
      const hashes = new Set(blocks.flatMap((b) => (b.type === 'code' && b.language === 'java' ? [codeHash(b.code)] : [])))
      for (const program of built[id].programs) expect(hashes.has(program.hash), `${program.title} changed`).toBe(true)
      expect(config[id].samples.length, 'at least one sample').toBeGreaterThan(0)
    })

    test(`${id}: every program passes the samples in the browser build`, () => {
      const bundle = bundles[`../runner/generated/${built[id].chunk}.js`]
      expect(bundle, `bundle ${built[id].chunk}.js`).toBeDefined()
      const blocks = parseProblemPage(sources[`../content/problem-pages/${id}.md`]).doc.blocks
      const runnables = blocks.flatMap((b) => (b.type === 'code' && b.language === 'java' ? [findRunnable(id, b.code)] : []))
      for (const program of built[id].programs) {
        const runnable = runnables.find((r) => r?.key === program.key)
        expect(runnable, program.title).toBeTruthy()
        for (const sample of config[id].samples) {
          const { status, stdout, stderr } = parseRun(bundle.run(program.key, sample.input))
          const label = `${program.title} on ${sample.label}`
          expect(status, `${label}: ${stderr}`).toBe('ok')
          expect(check(runnable!, sample.input, stdout, sample.output)?.ok, `${label}: got ${stdout}`).toBe(true)
        }
      }
    })
  }
})

describe('answer checkers', () => {
  const stdin = (kind: 'permutations' | 'two-sets') => ({ check: kind, format: 'stdin' as const })

  test('Permutations', () => {
    expect(check(stdin('permutations'), '5', '2 4 1 3 5', undefined)?.ok).toBe(true)
    expect(check(stdin('permutations'), '5', '1 2 4 3 5', undefined)?.ok).toBe(false)
    expect(check(stdin('permutations'), '4', 'NO SOLUTION', undefined)?.ok).toBe(false)
    expect(check(stdin('permutations'), '3', 'NO SOLUTION', undefined)?.ok).toBe(true)
    expect(check(stdin('permutations'), 'abc', '1', undefined)).toBeNull()
  })

  test('Two Sets', () => {
    expect(check(stdin('two-sets'), '7', 'YES 3 1 6 7 4 2 3 4 5', undefined)?.ok).toBe(true)
    expect(check(stdin('two-sets'), '7', 'YES 3 1 6 7 4 2 3 4 4', undefined)?.ok).toBe(false)
    expect(check(stdin('two-sets'), '6', 'NO', undefined)?.ok).toBe(true)
    expect(check(stdin('two-sets'), '8', 'NO', undefined)?.ok).toBe(false)
  })

  test('LeetCode values', () => {
    expect(sameValues('[2, 3]', '[2,3]', 'exact')).toBe(true)
    expect(sameValues('[3, 2]', '[2, 3]', 'exact')).toBe(false)
    expect(sameValues('[3, 2]', '[2, 3]', 'unordered')).toBe(true)
    expect(sameValues('[["b"], ["a", "c"]]', '[["c", "a"], ["b"]]', 'unordered')).toBe(false)
    expect(sameValues('[["b"], ["a", "c"]]', '[["c", "a"], ["b"]]', 'unordered-nested')).toBe(true)
    expect(sameValues('2.0', '2', 'exact')).toBe(true)
    expect(sameValues("s = ['o', 'k']", 's = ["o", "k"]', 'exact')).toBe(true)
    expect(sameValues('k = 2\nnums = [2, 1]', 'k = 2\nnums = [1, 2]', 'unordered')).toBe(true)
    expect(sameValues('6\nguess() calls: 3', '6', 'first-line')).toBe(true)
    expect(sameValues('"abc"', '"abd"', 'exact')).toBe(false)
  })
})
