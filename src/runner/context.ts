import { createContext } from 'react'

export type Sample = { label: string; input: string; output: string }

/**
 * How a run's output is judged. CSES (stdin) pages: `exact` compares tokens; `permutations`
 * and `two-sets` check the answer by rule. LeetCode pages: `exact` compares values, the
 * `unordered` modes ignore list order (top level, or every level), and `first-line` judges
 * only the first line (the rest is extra information such as a call count).
 */
export type CheckKind = 'exact' | 'unordered' | 'unordered-nested' | 'first-line' | 'permutations' | 'two-sets'

/** A program on a page that the reader can run. */
export type Runnable = {
  key: string
  chunk: string
  problemId: string
  format: 'stdin' | 'leetcode'
  hint: string
  check: CheckKind
  samples: Sample[]
}

/** Lets code blocks inside a page ask whether they can be run (null outside walkthrough pages). */
export const CodeRunContext = createContext<((code: string) => Runnable | null) | null>(null)
