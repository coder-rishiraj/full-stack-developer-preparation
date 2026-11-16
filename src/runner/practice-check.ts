import { check, parseValue, sameTokens } from './checkers'

/** One test's verdict: pass, fail, or `unknown` (several answers are correct and no checker exists). */
export type TestVerdict = { result: 'pass' | 'fail' | 'unknown'; note?: string }

export type CsesTests = { source: 'cses'; problemId: string; anyAnswer: boolean; interactive: boolean }
export type LeetCodeTests = { source: 'leetcode'; problemId: string; anyOrder: boolean }

type Value = ReturnType<typeof parseValue>

/** Values compared LeetCode-style: decimals to 1e-5, lists optionally in any order. */
function canonical(v: Value, anyOrder: boolean, depth = 0): unknown {
  if (v === undefined || v === null || typeof v === 'string' || typeof v === 'boolean') return v
  if (!Array.isArray(v)) return { num: Math.round(v.num * 1e5) / 1e5 }
  const items = v.map((x) => canonical(x, anyOrder, depth + 1))
  // LeetCode's "any order" is about the answer's elements (and, for groups, each group's own order).
  return anyOrder ? items.map((x) => JSON.stringify(x)).sort() : items
}

function sameValue(output: string, expected: string, anyOrder: boolean): boolean | null {
  const a = parseValue(output.trim())
  const b = parseValue(expected.trim())
  if (b === undefined) return null
  if (a === undefined) return false
  return JSON.stringify(canonical(a, anyOrder)) === JSON.stringify(canonical(b, anyOrder))
}

/** LeetCode's in-place format "k, nums = [1,2,_,_]": compare k and the first k values. */
function sameInPlace(output: string, expected: string, anyOrder: boolean): boolean | null {
  const exp = expected.trim().match(/^(-?\d+),\s*\w+\s*=\s*\[(.*)\]$/)
  if (!exp) return null
  const got = output.trim().match(/^(-?\d+),\s*\w+\s*=\s*\[(.*)\]$/)
  if (!got || got[1] !== exp[1]) return false
  const k = Number(exp[1])
  const want = exp[2].split(',').map((s) => s.trim()).filter((s) => s && s !== '_').slice(0, k)
  const have = got[2].split(',').map((s) => s.trim()).filter(Boolean).slice(0, k)
  if (anyOrder) {
    want.sort()
    have.sort()
  }
  return want.length === have.length && want.every((x, i) => x === have[i])
}

export function verdict(tests: CsesTests | LeetCodeTests, input: string, output: string, expected: string | null): TestVerdict {
  if (expected === null) return { result: 'unknown', note: 'The expected output could not be read from the statement.' }
  if (tests.source === 'cses') {
    if (sameTokens(output, expected)) return { result: 'pass' }
    if (tests.problemId === 'cses-permutations' || tests.problemId === 'cses-two-sets') {
      const kind = tests.problemId === 'cses-permutations' ? 'permutations' : 'two-sets'
      const v = check({ check: kind, format: 'stdin' }, input, output, undefined)
      if (v) return { result: v.ok ? 'pass' : 'fail', note: v.message }
    }
    if (tests.anyAnswer) {
      return { result: 'unknown', note: 'This problem accepts any valid answer; yours differs from the official one, so check it against the statement.' }
    }
    return { result: 'fail' }
  }
  const lines = output.split('\n').filter((l) => l.trim())
  const answer = lines.at(-1) ?? ''
  const inPlace = sameInPlace(answer, expected, tests.anyOrder)
  const same = inPlace ?? sameValue(answer, expected, tests.anyOrder)
  if (same === null) return { result: 'unknown', note: 'The expected output is not in a form that can be compared automatically.' }
  return same
    ? { result: 'pass', note: lines.length > 1 ? 'Lines printed before the answer are ignored.' : undefined }
    : { result: 'fail' }
}
