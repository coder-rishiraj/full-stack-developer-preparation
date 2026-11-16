import type { CheckKind, Runnable } from './context'

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
/** CSES Palindrome Reorder: any palindrome using exactly the input's letters, or NO SOLUTION. */
function checkPalindrome(input: string, output: string): Verdict {
  const s = input.trim()
  if (!/^[A-Z]{1,1000000}$/.test(s)) return null
  const counts = new Map<string, number>()
  for (const c of s) counts.set(c, (counts.get(c) ?? 0) + 1)
  const possible = [...counts.values()].filter((n) => n % 2 === 1).length <= 1
  const out = output.trim()
  if (out === 'NO SOLUTION') {
    return possible
      ? { ok: false, message: 'A palindrome can be formed from these letters, so NO SOLUTION is wrong.' }
      : { ok: true, message: 'More than one letter occurs an odd number of times, so no palindrome exists.' }
  }
  if (!possible) return { ok: false, message: 'More than one letter occurs an odd number of times; the answer must be NO SOLUTION.' }
  if (out.length !== s.length) return { ok: false, message: `Expected ${s.length} letters, got ${out.length}.` }
  for (let i = 0, j = out.length - 1; i < j; i++, j--) {
    if (out[i] !== out[j]) return { ok: false, message: `Not a palindrome: position ${i + 1} is ${out[i]} but position ${j + 1} is ${out[j]}.` }
  }
  const used = new Map<string, number>()
  for (const c of out) used.set(c, (used.get(c) ?? 0) + 1)
  for (const [c, n] of counts) if (used.get(c) !== n) return { ok: false, message: `The letter ${c} appears ${used.get(c) ?? 0} times instead of ${n}.` }
  return { ok: true, message: 'Valid: a palindrome using exactly the input letters.' }
}

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

// ---------------------------------------------------------------- LeetCode-style values

type Value = string | boolean | null | { num: number } | Value[]

/** Parses one printed value: numbers, "strings", 'c', true/false/null, [lists]. Null on failure. */
export function parseValue(text: string): Value | undefined {
  let i = 0
  const space = () => {
    while (i < text.length && /\s/.test(text[i])) i++
  }
  const value = (): Value => {
    space()
    const c = text[i]
    if (c === '[') {
      i++
      const items: Value[] = []
      space()
      if (text[i] === ']') {
        i++
        return items
      }
      for (;;) {
        items.push(value())
        space()
        if (text[i] === ',') i++
        else if (text[i] === ']') {
          i++
          return items
        } else throw new Error('bad list')
      }
    }
    if (c === '"' || c === "'") {
      i++
      let out = ''
      while (i < text.length && text[i] !== c) {
        if (text[i] === '\\' && i + 1 < text.length) {
          const e = text[i + 1]
          out += e === 'n' ? '\n' : e === 't' ? '\t' : e
          i += 2
        } else out += text[i++]
      }
      if (text[i] !== c) throw new Error('unclosed string')
      i++
      return out
    }
    const m = text.slice(i).match(/^[^\s,\]]+/)
    if (!m) throw new Error('bad value')
    i += m[0].length
    if (m[0] === 'true') return true
    if (m[0] === 'false') return false
    if (m[0] === 'null') return null
    const num = Number(m[0])
    if (Number.isNaN(num)) throw new Error('bad number')
    return { num }
  }
  try {
    const v = value()
    space()
    return i === text.length ? v : undefined
  } catch {
    return undefined
  }
}

const key = (v: Value): string => JSON.stringify(v)

function normalise(v: Value, mode: CheckKind, depth = 0): Value {
  if (!Array.isArray(v)) return v
  const nested = mode === 'unordered-nested'
  const items = v.map((x) => (nested ? normalise(x, mode, depth + 1) : x))
  return (mode === 'unordered' && depth === 0) || nested ? [...items].sort((a, b) => key(a).localeCompare(key(b))) : items
}

/** One output line as [name or "", value]; the value is undefined if it does not parse. */
function line(text: string): [string, Value | undefined] {
  const m = text.trim().match(/^([A-Za-z_]\w*)\s*=\s*(.*)$/)
  return m ? [m[1], parseValue(m[2])] : ['', parseValue(text.trim())]
}

/** LeetCode-style comparison of printed values, line by line. */
export function sameValues(output: string, expected: string, mode: CheckKind): boolean {
  let out = output.split('\n').filter((l) => l.trim())
  let exp = expected.split('\n').filter((l) => l.trim())
  if (mode === 'first-line') {
    out = out.slice(0, 1)
    exp = exp.slice(0, 1)
  } else if (out.length > exp.length) {
    // The harness prints the answer last; lines before it are the reader's own prints.
    out = out.slice(out.length - exp.length)
  }
  if (out.length !== exp.length) return false
  return out.every((o, i) => {
    const [na, a] = line(o)
    const [nb, b] = line(exp[i])
    if (a === undefined || b === undefined) return o.trim() === exp[i].trim()
    return na === nb && key(normalise(a, mode)) === key(normalise(b, mode))
  })
}

/**
 * Checks a run's output. Answers with one right output are compared with `expected`
 * (known only for the statement's samples); CSES problems with many correct answers are
 * checked by rule, on any input.
 */
export function check(runnable: Pick<Runnable, 'check' | 'format'>, input: string, output: string, expected: string | undefined): Verdict {
  const kind = runnable.check
  if (kind === 'permutations') return checkPermutations(input, output)
  if (kind === 'two-sets') return checkTwoSets(input, output)
  if (kind === 'palindrome') return checkPalindrome(input, output)
  if (expected === undefined) return null
  const same = runnable.format === 'stdin' ? sameTokens(output, expected) : sameValues(output, expected, kind)
  const extra =
    runnable.format !== 'stdin' && kind !== 'first-line' && output.split('\n').filter((l) => l.trim()).length > expected.split('\n').filter((l) => l.trim()).length
  const note = (kind === 'unordered' || kind === 'unordered-nested' ? ' (in any order)' : '') + (extra ? '; the lines printed before the answer are ignored' : '')
  return same
    ? { ok: true, message: `Matches the expected output${note}.` }
    : { ok: false, message: `Differs from the expected output${note}.` }
}
