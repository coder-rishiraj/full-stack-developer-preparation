import type { CheckKind } from './context'

/** A verdict on an output, or null when the input is outside the problem's limits. */
export type Verdict = { ok: boolean; message: string } | null

const tokens = (s: string) => s.split(/\s+/).filter(Boolean)

/** Reads the single integer n (1 ≤ n ≤ 10^6) that both checked problems take as input. */
function readN(input: string): number | null {
  const t = tokens(input)
  if (t.length !== 1 || !/^\d+$/.test(t[0])) return null
  const n = Number(t[0])
  return n >= 1 && n <= 1_000_000 ? n : null
}

/** Exact answer: compare whitespace-separated tokens, as the CSES judge does. */
export function sameTokens(output: string, expected: string): boolean {
  const a = tokens(output)
  const b = tokens(expected)
  return a.length === b.length && a.every((x, i) => x === b[i])
}

/** CSES Permutations: a permutation of 1..n with no adjacent pair differing by 1, or NO SOLUTION. */
function checkPermutations(input: string, output: string): Verdict {
  const n = readN(input)
  if (n === null) return null
  const possible = !(n === 2 || n === 3)
  const t = tokens(output)
  if (t.join(' ') === 'NO SOLUTION') {
    return possible
      ? { ok: false, message: `A beautiful permutation exists for n = ${n}, so NO SOLUTION is wrong.` }
      : { ok: true, message: `No beautiful permutation exists for n = ${n}.` }
  }
  if (!possible) return { ok: false, message: `No beautiful permutation exists for n = ${n}; expected NO SOLUTION.` }
  if (t.length !== n) return { ok: false, message: `Expected ${n} numbers, got ${t.length}.` }
  const seen = new Uint8Array(n + 1)
  let prev = 0
  for (let i = 0; i < n; i++) {
    const v = Number(t[i])
    if (!Number.isInteger(v) || v < 1 || v > n || seen[v]) return { ok: false, message: `"${t[i]}" is not a new number from 1 to ${n}.` }
    seen[v] = 1
    if (i > 0 && Math.abs(v - prev) === 1) return { ok: false, message: `${prev} and ${v} are adjacent and differ by 1.` }
    prev = v
  }
  return { ok: true, message: 'Valid: every number from 1 to n once, and no neighbours differ by 1.' }
}

/** CSES Two Sets: YES with two sets of equal sum covering 1..n, or NO when the total is odd. */
function checkTwoSets(input: string, output: string): Verdict {
  const n = readN(input)
  if (n === null) return null
  const total = (n * (n + 1)) / 2
  const possible = total % 2 === 0
  const t = tokens(output)
  if (t.length === 1 && t[0] === 'NO') {
    return possible
      ? { ok: false, message: `1 + … + ${n} = ${total} is even, so a split exists; NO is wrong.` }
      : { ok: true, message: `1 + … + ${n} = ${total} is odd, so no split exists.` }
  }
  if (t[0] !== 'YES') return { ok: false, message: 'The first line must be YES or NO.' }
  if (!possible) return { ok: false, message: `1 + … + ${n} = ${total} is odd, so the answer must be NO.` }
  const seen = new Uint8Array(n + 1)
  let pos = 1
  const sums: number[] = []
  for (let set = 0; set < 2; set++) {
    const k = Number(t[pos++])
    if (!Number.isInteger(k) || k < 0 || pos + k > t.length) return { ok: false, message: `Set ${set + 1} has a bad size line.` }
    let sum = 0
    for (let i = 0; i < k; i++) {
      const v = Number(t[pos++])
      if (!Number.isInteger(v) || v < 1 || v > n || seen[v]) return { ok: false, message: `"${t[pos - 1]}" is not a new number from 1 to ${n}.` }
      seen[v] = 1
      sum += v
    }
    sums.push(sum)
  }
  if (pos !== t.length) return { ok: false, message: 'There is extra output after the second set.' }
  for (let v = 1; v <= n; v++) if (!seen[v]) return { ok: false, message: `${v} is in neither set.` }
  if (sums[0] !== sums[1]) return { ok: false, message: `The sums differ: ${sums[0]} and ${sums[1]}.` }
  return { ok: true, message: `Valid: both sets sum to ${sums[0]} and together hold 1 to ${n} once each.` }
}

/**
 * Checks a run's output. Exact problems are compared with `expected` (only known for the
 * statement's samples); problems with many correct answers are checked by rule, on any input.
 */
export function check(kind: CheckKind, input: string, output: string, expected: string | undefined): Verdict {
  if (kind === 'permutations') return checkPermutations(input, output)
  if (kind === 'two-sets') return checkTwoSets(input, output)
  if (expected === undefined) return null
  return sameTokens(output, expected)
    ? { ok: true, message: 'Matches the expected output.' }
    : { ok: false, message: 'Differs from the expected output.' }
}
