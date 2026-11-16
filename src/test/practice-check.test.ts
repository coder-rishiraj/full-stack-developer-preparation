import { describe, expect, test } from 'vitest'
import { verdict } from '@/runner/practice-check'
import { leetcodeHarness, type LeetCodeMeta } from '@/runner/java/leetcode-harness'
import { PROBLEMS } from '@/content/problems'

const lc = (anyOrder = false) => ({ source: 'leetcode' as const, problemId: 'x', anyOrder })
const cses = (anyAnswer = false, problemId = 'cses-x') => ({ source: 'cses' as const, problemId, anyAnswer, interactive: false })

describe('Check verdicts', () => {
  test('LeetCode values', () => {
    expect(verdict(lc(), '', '[0, 1]\n', '[0,1]').result).toBe('pass')
    expect(verdict(lc(), '', '[1, 0]\n', '[0,1]').result).toBe('fail')
    expect(verdict(lc(true), '', '[1, 0]\n', '[0,1]').result).toBe('pass')
    expect(verdict(lc(), '', '2.5\n', '2.50000').result).toBe('pass')
    expect(verdict(lc(), '', '"bab"\n', '"bab"').result).toBe('pass')
    expect(verdict(lc(), '', 'debug line\n[5, 4]\n', '[5,4]').result).toBe('pass')
    expect(verdict(lc(true), '', '[["tan", "nat"], ["bat"]]\n', '[["bat"],["nat","tan"]]').result).toBe('pass')
  })

  test('LeetCode in-place answers ("k, nums = [...]")', () => {
    expect(verdict(lc(true), '', '2, nums = [2, 2]\n', '2, nums = [2,2,_,_]').result).toBe('pass')
    expect(verdict(lc(true), '', '3, nums = [2, 2, 1]\n', '2, nums = [2,2,_,_]').result).toBe('fail')
    expect(verdict(lc(true), '', '5, nums = [0, 1, 3, 0, 4]\n', '5, nums = [0,1,4,0,3,_,_,_]').result).toBe('pass')
  })

  test('CSES', () => {
    expect(verdict(cses(), '3', '3 10 5 16 8 4 2 1 \n', '3 10 5 16 8 4 2 1\n').result).toBe('pass')
    expect(verdict(cses(), '3', '3 10 5\n', '3 10 5 16\n').result).toBe('fail')
    expect(verdict(cses(true), '5', '1 3 5 2 4\n', '2 4 1 3 5\n').result).toBe('unknown')
    expect(verdict(cses(true, 'cses-permutations'), '5', '1 3 5 2 4\n', '2 4 1 3 5\n').result).toBe('pass')
    expect(verdict(cses(true, 'cses-permutations'), '5', '1 2 3 4 5\n', '2 4 1 3 5\n').result).toBe('fail')
    expect(verdict(cses(true, 'cses-palindrome-reorder'), 'AAAACACBA', 'CAAABAAAC\n', 'AAACBCAAA\n').result).toBe('pass')
    expect(verdict(cses(true, 'cses-palindrome-reorder'), 'AAAACACBA', 'AAACBCAAB\n', 'AAACBCAAA\n').result).toBe('fail')
    expect(verdict(cses(true, 'cses-palindrome-reorder'), 'ABZ', 'NO SOLUTION\n', 'NO SOLUTION\n').result).toBe('pass')
    expect(verdict(cses(true, 'cses-palindrome-reorder'), 'AAB', 'NO SOLUTION\n', 'ABA\n').result).toBe('fail')
    // Sum of Two / Three / Four Values: any valid positions, or IMPOSSIBLE only when none exist.
    expect(verdict(cses(true, 'cses-sum-of-two-values'), '4 8\n2 7 5 1', '4 2\n', '2 4\n').result).toBe('pass')
    expect(verdict(cses(true, 'cses-sum-of-two-values'), '4 8\n2 7 5 1', '1 3\n', '2 4\n').result).toBe('fail')
    expect(verdict(cses(true, 'cses-sum-of-two-values'), '3 100\n1 2 3', 'IMPOSSIBLE\n', 'IMPOSSIBLE\n').result).toBe('pass')
    expect(verdict(cses(true, 'cses-sum-of-two-values'), '4 8\n2 7 5 1', 'IMPOSSIBLE\n', '2 4\n').result).toBe('fail')
    expect(verdict(cses(true, 'cses-sum-of-three-values'), '4 8\n2 7 5 1', '1 3 4\n', '1 3 4\n').result).toBe('pass')
    expect(verdict(cses(true, 'cses-sum-of-four-values'), '8 15\n3 2 5 8 1 3 2 3', '1 2 3 5\n', '2 4 6 7\n').result).toBe('fail')
    expect(verdict(cses(true, 'cses-sum-of-four-values'), '8 15\n3 2 5 8 1 3 2 3', '1 2 4 7\n', '2 4 6 7\n').result).toBe('pass')
    // Subarray Sum Constraints: any valid array, or NO only when contradictory.
    const sc = cses(true, 'cses-subarray-sum-constraints')
    const ex = '5 3\n1 3 3\n3 5 3\n4 4 -1\n'
    expect(verdict(sc, ex, 'YES\n0 2 1 -1 3\n', 'YES\n0 0 3 -1 1\n').result).toBe('pass')
    expect(verdict(sc, ex, 'YES\n0 0 3 -1 2\n', 'YES\n0 0 3 -1 1\n').result).toBe('fail')
    expect(verdict(sc, ex, 'NO\n', 'YES\n0 0 3 -1 1\n').result).toBe('fail')
    expect(verdict(sc, '3 3\n1 1 2\n2 3 4\n1 3 5\n', 'NO\n', 'NO\n').result).toBe('pass')
    expect(verdict(sc, '2 1\n2 2 5\n', 'YES\n0 5\n', 'YES\n0 5\n').result).toBe('pass')
    // Swap Round Sorting: minimum rounds of disjoint swaps that sort the array.
    const sr = cses(true, 'cses-swap-round-sorting')
    expect(verdict(sr, '5\n5 2 1 3 4', '2\n2\n1 3\n4 5\n1\n3 5\n', '').result).toBe('pass')
    expect(verdict(sr, '5\n5 2 1 3 4', '3\n1\n1 3\n1\n4 5\n1\n3 5\n', '').result).toBe('fail')
    expect(verdict(sr, '2\n2 1', '1\n1\n1 2\n', '').result).toBe('pass')
    expect(verdict(sr, '3\n1 2 3', '0\n', '').result).toBe('pass')
    expect(verdict(sr, '3\n2 3 1', '2\n1\n1 2\n1\n2 3\n', '').result).toBe('fail')
  })
})

describe('LeetCode harness', () => {
  test('method, design, linked list and tree signatures', () => {
    const method = leetcodeHarness({ name: 'twoSum', params: [{ name: 'nums', type: 'integer[]' }, { name: 'target', type: 'integer' }], return: { type: 'integer[]' } })
    expect('files' in method && method.files['Main.java']).toContain('new Solution().twoSum(nums, target)')
    const tree = leetcodeHarness({ name: 'invertTree', params: [{ name: 'root', type: 'TreeNode' }], return: { type: 'TreeNode' } })
    expect('files' in tree && tree.files['Main.java']).toContain('Judge.showNode(result)')
    const design = leetcodeHarness({ classname: 'MinStack', constructor: { params: [] }, methods: [{ name: 'getMin', params: [], return: { type: 'integer' } }] } as LeetCodeMeta)
    expect('files' in design && design.files['Main.java']).toContain('case "MinStack": obj = new MinStack()')
    expect(leetcodeHarness({ name: 'f', params: [{ name: 'g', type: 'Node' }], return: { type: 'integer' } })).toHaveProperty('error')
  })
})

const files = import.meta.glob<{ tests: { input: string; output: string | null }[]; meta?: LeetCodeMeta; starter?: string }>(
  '../../public/tests/*/*.json',
  { eager: true, import: 'default' },
)

describe('Test data for the Check button', () => {
  const byId = new Map(Object.entries(files).map(([p, d]) => [p.split('/').pop()!.replace(/\.json$/, ''), d]))

  test('files belong to known problems and hold tests', () => {
    const ids = new Set(PROBLEMS.map((p) => p.id))
    for (const [id, data] of byId) {
      expect(ids.has(id), id).toBe(true)
      expect(Array.isArray(data.tests), id).toBe(true)
    }
  })

  test('most problems have tests (LeetCode premium and CSES interactive problems may not)', () => {
    const cses = PROBLEMS.filter((p) => p.source === 'cses')
    const nc = PROBLEMS.filter((p) => p.source === 'neetcode250')
    expect(cses.filter((p) => byId.get(p.id)?.tests.length).length).toBeGreaterThan(cses.length * 0.9)
    expect(nc.filter((p) => byId.get(p.id)?.tests.length).length).toBeGreaterThan(nc.length * 0.9)
  })

  test('every LeetCode problem with tests can generate a harness, or says why not', () => {
    for (const [id, data] of byId) {
      if (!data.meta) continue
      const h = leetcodeHarness(data.meta)
      expect('files' in h || /not available/.test(h.error), id).toBe(true)
      expect(data.starter, id).toBeTruthy()
    }
  })
})
