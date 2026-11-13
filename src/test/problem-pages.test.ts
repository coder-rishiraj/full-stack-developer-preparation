import { describe, expect, test } from 'vitest'
import { getTopicMeta } from '@/content/taxonomy'
import { getProblem } from '@/content/problems'
import { checkProblemPage } from '@/content/problem-pages/validate'
import { parseProblemPage } from '@/content/problem-pages'

const sources = import.meta.glob<string>(['../content/problem-pages/*.md', '!../content/problem-pages/PROGRESS.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
})
const SOURCE_BY_FILE = Object.fromEntries(Object.entries(sources).map(([p, src]) => [p.split('/').pop()!, src]))
const files = Object.keys(SOURCE_BY_FILE).sort()

const ctx = { getProblem, isTopic: (id: string) => Boolean(getTopicMeta(id)) }

// Java tests run by `npm run problems:verify`; here we only require that each page has them.
const javaTests = import.meta.glob<string>('../content/problem-pages/tests/*.java', { query: '?raw', import: 'default', eager: true })
const TESTED = new Set(Object.keys(javaTests).map((p) => p.split('/').pop()!.replace(/\.java$/, '')))

describe('problem page frontmatter', () => {
  test('reads inline and dash lists', () => {
    const { frontmatter } = parseProblemPage(`---
problemId: nc-two-sum
patterns: [arrays-hashing, hashing]
relatedLessons:
  - a2-hashing
companies: []
timeToSolve: 10
---
## 1. Problem restatement
`)
    expect(frontmatter.patterns).toEqual(['arrays-hashing', 'hashing'])
    expect(frontmatter.relatedLessons).toEqual(['a2-hashing'])
    expect(frontmatter.companies).toEqual([])
    expect(frontmatter.timeToSolve).toBe(10)
  })
})

describe('problem pages', () => {
  test('problem page directory is readable', () => {
    expect(Array.isArray(files)).toBe(true)
  })

  test.each(files)('%s', (file: string) => {
    const id = file.replace(/\.md$/, '')
    const result = checkProblemPage(id, SOURCE_BY_FILE[file], ctx)
    expect(result.errors, `${file}:\n  ${result.errors.join('\n  ')}`).toEqual([])
    expect(TESTED.has(id), `${file}: missing tests/${id}.java (see docs/PROBLEM_PAGE_GUIDE.md §6)`).toBe(true)
    expect(javaTests[`../content/problem-pages/tests/${id}.java`]).toMatch(/class Tests\b/)
  })
})
