import { describe, expect, test } from 'vitest'
import { parseProblemPage } from '@/content/problem-pages'
import samplesConfig from '@/content/problem-pages/run-samples.json'
import manifest from '@/runner/generated/manifest.json'
import { run } from '@/runner/generated/java-programs.js'
import { check } from '@/runner/checkers'
import { codeHash, findRunnable } from '@/runner/run-java'
import type { CheckKind, Sample } from '@/runner/context'

const sources = import.meta.glob<string>('../content/problem-pages/*.md', { query: '?raw', import: 'default', eager: true })
const sourceFor = (id: string) => sources[`../content/problem-pages/${id}.md`]

const config = samplesConfig as Record<string, { check: CheckKind; samples: Sample[] }>
const builds = manifest as Record<string, { key: string; title: string; hash: string }[]>
const isProgram = (code: string) => /^public\s+(final\s+)?class\s+Main\b/m.test(code) && /static\s+void\s+main\s*\(/.test(code)

describe('in-browser Java runner', () => {
  test('every page in run-samples.json has a build, and vice versa', () => {
    expect(Object.keys(builds).sort()).toEqual(Object.keys(config).sort())
  })

  for (const id of Object.keys(config)) {
    test(`${id}: the build is current (run \`npm run problems:runner\` after editing the code)`, () => {
      const source = sourceFor(id)
      expect(source, `${id}.md`).toBeTypeOf('string')
      const programs = parseProblemPage(source).doc.blocks.flatMap((b) =>
        b.type === 'code' && b.language === 'java' && isProgram(b.code) ? [b.code] : [],
      )
      expect(programs.map(codeHash)).toEqual(builds[id].map((e) => e.hash))
      for (const code of programs) expect(findRunnable(id, code)).not.toBeNull()
    })

    test(`${id}: every program passes the samples in the browser build`, () => {
      for (const { key, title } of builds[id]) {
        for (const sample of config[id].samples) {
          const [status, stdout] = run(key, sample.input).split('\u0000')
          expect(status, `${title} on ${sample.label}`).toBe('ok')
          expect(check(config[id].check, sample.input, stdout, sample.output)?.ok, `${title} on ${sample.label}`).toBe(true)
        }
      }
    })
  }
})

describe('answer checkers', () => {
  test('Permutations', () => {
    expect(check('permutations', '5', '2 4 1 3 5', undefined)?.ok).toBe(true)
    expect(check('permutations', '5', '1 2 4 3 5', undefined)?.ok).toBe(false)
    expect(check('permutations', '4', 'NO SOLUTION', undefined)?.ok).toBe(false)
    expect(check('permutations', '3', 'NO SOLUTION', undefined)?.ok).toBe(true)
    expect(check('permutations', 'abc', '1', undefined)).toBeNull()
  })

  test('Two Sets', () => {
    expect(check('two-sets', '7', 'YES 3 1 6 7 4 2 3 4 5', undefined)?.ok).toBe(true)
    expect(check('two-sets', '7', 'YES 3 1 6 7 4 2 3 4 4', undefined)?.ok).toBe(false)
    expect(check('two-sets', '6', 'NO', undefined)?.ok).toBe(true)
    expect(check('two-sets', '8', 'NO', undefined)?.ok).toBe(false)
  })
})
