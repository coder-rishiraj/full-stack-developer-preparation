import { describe, expect, test } from 'vitest'
import { parseProblemPage } from '@/content/problem-pages'
import samplesConfig from '@/content/problem-pages/run-samples.json'
import manifest from '@/runner/generated/manifest.json'
import lessonsManifest from '@/runner/generated/lessons-manifest.json'
import { findLessonRunnable } from '@/runner/lesson-runnables'
import { parseLesson } from '@/lib/lesson-markdown'
import jsLessonsManifest from '@/runner/generated/js-lessons-manifest.json'
import { sourceLang } from '@/runner/js/compile'
import { format, inspect } from '@/runner/js/runtime'
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
    }, 60_000) // slow rungs (exhaustive search) run as JavaScript here
  }
})

const lessonSources = import.meta.glob<string>('../content/lessons/a*.md', { query: '?raw', import: 'default', eager: true })
type BuiltLesson = { chunk: string; programs: { key: string; title: string; hash: string }[] }
const builtLessons = (lessonsManifest as unknown as { lessons: Record<string, BuiltLesson>; chunks: Record<string, string> })

describe('Track A lesson programs', () => {
  test('every Track A module has been built', () => {
    const modules = new Set(
      Object.keys(lessonSources)
        .map((p) => p.split('/').pop()!)
        .filter((f) => /^a\d+-/.test(f))
        .map((f) => `lessons-${f.split('-')[0]}`),
    )
    for (const m of modules) expect(builtLessons.chunks[m], `${m}: run npm run lessons:runner`).toBeTruthy()
  })

  for (const [lessonId, lesson] of Object.entries(builtLessons.lessons)) {
    test(`${lessonId}: the build is current (run \`npm run lessons:runner\` after editing its Java)`, () => {
      const source = lessonSources[`../content/lessons/${lessonId}.md`]
      expect(source, `${lessonId}.md`).toBeTypeOf('string')
      const blocks = parseLesson(source).blocks.flatMap((b) => (b.type === 'code' && b.language === 'java' ? [b.code] : []))
      const hashes = new Set(blocks.map(codeHash))
      for (const program of lesson.programs) expect(hashes.has(program.hash), `${program.title} changed`).toBe(true)
      for (const code of blocks) {
        const runnable = findLessonRunnable(lessonId, code)
        if (runnable) expect(bundles[`../runner/generated/${runnable.chunk}.js`], runnable.chunk).toBeDefined()
      }
    })
  }
})

/** Every code block in a lesson, including those inside lists and callouts. */
function allCodeBlocks(source: string): { language: string; code: string }[] {
  const out: { language: string; code: string }[] = []
  const walk = (blocks: ReturnType<typeof parseLesson>['blocks']) => {
    for (const b of blocks) {
      if (b.type === 'code') out.push(b)
      else if (b.type === 'callout' || b.type === 'quote') walk(b.blocks)
      else if (b.type === 'list') for (const item of b.items) walk(item.children)
    }
  }
  walk(parseLesson(source).blocks)
  return out
}

const allLessonSources = import.meta.glob<string>('../content/lessons/*.md', { query: '?raw', import: 'default', eager: true })
const jsLessons = (jsLessonsManifest as unknown as { lessons: Record<string, { hash: string }[]>; excluded: Record<string, unknown[]> })

describe('JavaScript/TypeScript lesson blocks', () => {
  test('every lesson with JavaScript/TypeScript has been checked (run npm run lessons:js-runner)', () => {
    const checked = new Set([...Object.keys(jsLessons.lessons), ...Object.keys(jsLessons.excluded)])
    const missing = Object.entries(allLessonSources)
      .filter(([, src]) => allCodeBlocks(src).some((b) => sourceLang(b.language) !== null))
      .map(([p]) => p.split('/').pop()!.replace(/\.md$/, ''))
      .filter((id) => !checked.has(id))
    expect(missing).toEqual([])
  })

  for (const [lessonId, entries] of Object.entries(jsLessons.lessons)) {
    test(`${lessonId}: the JavaScript/TypeScript check is current`, () => {
      const source = allLessonSources[`../content/lessons/${lessonId}.md`]
      expect(source, `${lessonId}.md`).toBeTypeOf('string')
      const hashes = new Set(
        allCodeBlocks(source).flatMap((b) => (sourceLang(b.language) !== null ? [codeHash(b.code)] : [])),
      )
      const stale = entries.filter((e) => !hashes.has(e.hash))
      expect(stale.length, 'blocks changed since the last npm run lessons:js-runner').toBe(0)
    })
  }
})

describe('preview frame runtime', () => {
  test('public/runner/page-runtime.js is built (npm run runner:page)', () => {
    const files = import.meta.glob<string>('../../public/runner/page-runtime.js', { query: '?raw', import: 'default', eager: true })
    const text = Object.values(files)[0] ?? ''
    expect(text.length).toBeGreaterThan(100_000)
    expect(text).toMatch(/["`']ready["`']/)
  })
})

describe('Node-style console formatting', () => {
  test('matches Node for common values', () => {
    expect(inspect({ a: 1, b: 'x' })).toBe("{ a: 1, b: 'x' }")
    expect(inspect([1, 2, 3])).toBe('[ 1, 2, 3 ]')
    expect(inspect(new Map([['a', 1]]))).toBe("Map(1) { 'a' => 1 }")
    expect(inspect(new Set())).toBe('Set(0) {}')
    expect(inspect({ 'a-b': [] })).toBe("{ 'a-b': [] }")
    expect(inspect({ a: { b: { c: { d: 1 } } } })).toBe('{ a: { b: { c: [Object] } } }')
    expect(inspect("it's")).toBe('"it\'s"')
    expect(inspect(-0)).toBe('-0')
    expect(inspect(class Foo {})).toBe('[class Foo]')
    expect(inspect(function named() {})).toBe('[Function: named]')
    expect(format(['%s is %d years', 'Ada', 36])).toBe('Ada is 36 years')
    expect(inspect(Array.from({ length: 10 }, (_, i) => i))).toBe('[\n  0, 1, 2, 3, 4,\n  5, 6, 7, 8, 9\n]')
  })
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
