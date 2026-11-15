import { createContext } from 'react'

export type Sample = { label: string; input: string; output: string }
export type CheckKind = 'exact' | 'permutations' | 'two-sets'

/** A program on a page that the reader can run. */
export type Runnable = { key: string; problemId: string; check: CheckKind; samples: Sample[] }

/** Lets code blocks inside a page ask whether they can be run (null outside walkthrough pages). */
export const CodeRunContext = createContext<((code: string) => Runnable | null) | null>(null)
