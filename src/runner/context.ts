import { createContext } from 'react'

export type Sample = { label: string; input: string; output: string }

/**
 * How a run's output is judged. CSES (stdin) pages: `exact` compares tokens; `permutations`
 * and `two-sets` check the answer by rule. LeetCode pages: `exact` compares values, the
 * `unordered` modes ignore list order (top level, or every level), and `first-line` judges
 * only the first line (the rest is extra information such as a call count).
 */
export type CheckKind = 'exact' | 'unordered' | 'unordered-nested' | 'first-line' | 'permutations' | 'two-sets' | 'palindrome'

/** A program on a page that the reader can run. */
export type Runnable = {
  key: string
  chunk: string
  problemId: string
  /**
   * stdin: CSES program; leetcode: generated harness; lesson: a Java lesson program, run as it
   * is; js: lesson JavaScript/TypeScript, editable and run in the browser.
   */
  format: 'stdin' | 'leetcode' | 'lesson' | 'js'
  /** For js: the source language. */
  lang?: 'js' | 'ts' | 'jsx' | 'tsx'
  /** For js: where it runs (node: the Node-like worker; page: a sandboxed frame with a DOM). */
  env?: 'node' | 'page'
  /**
   * false when the build found that the block, exactly as written, does not run the same in
   * the browser (a fragment, or code that needs files, a server or packages the runner lacks).
   * It is still editable and runnable; `note` says why the original may not work.
   */
  verified?: boolean
  note?: string
  hint: string
  /** For lesson programs: whether the program reads standard input (then it gets an input box). */
  stdin?: boolean
  check: CheckKind
  samples: Sample[]
}

/** Lets code blocks inside a page ask whether they can be run (null outside walkthrough pages). */
export const CodeRunContext = createContext<((code: string, language: string) => Runnable | null) | null>(null)

/** Every Java block of the page, in order: a program may build on classes from earlier blocks. */
export const JavaBlocksContext = createContext<string[]>([])
