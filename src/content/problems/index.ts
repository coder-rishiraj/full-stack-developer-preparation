import type { DsaProblem } from '@/domain/types'
import { CSES_PROBLEMS } from './cses'
import { NEETCODE_250 } from './neetcode250'

/** Full Phase 3 DSA index: NeetCode 250 + CSES 400. */
export const PROBLEMS: DsaProblem[] = [...NEETCODE_250, ...CSES_PROBLEMS]

export { CSES_PROBLEMS, NEETCODE_250 }

export function getProblem(id: string): DsaProblem | undefined {
  return PROBLEMS.find((p) => p.id === id)
}

export function getProblemsForTopic(topicId: string): DsaProblem[] {
  return PROBLEMS.filter((p) => p.primaryTopic === topicId)
}

export function getProblemCategories(source?: DsaProblem['source']): string[] {
  const set = new Set<string>()
  for (const p of PROBLEMS) {
    if (source && p.source !== source) continue
    set.add(p.category)
  }
  return [...set].sort()
}

export type ProblemFilters = {
  source?: 'cses' | 'neetcode250'
  category?: string
  topic?: string
  pattern?: string
  difficulty?: DsaProblem['difficulty']
  priority?: DsaProblem['priority']
  status?: string
  needsRevision?: boolean
  solvedIndependently?: boolean
  solvedWithHints?: boolean
  unsolved?: boolean
  query?: string
  urlVerified?: boolean
}

export function filterProblems(
  problems: DsaProblem[],
  filters: ProblemFilters,
  statusById: Record<string, { status: string; solvedIndependently?: boolean; solvedWithHints?: boolean }>,
): DsaProblem[] {
  const q = filters.query?.trim().toLowerCase()
  return problems.filter((p) => {
    if (filters.source && p.source !== filters.source) return false
    if (filters.category && p.category !== filters.category) return false
    if (filters.topic && p.primaryTopic !== filters.topic) return false
    if (filters.pattern && p.primaryPattern !== filters.pattern && !p.secondaryPatterns.includes(filters.pattern))
      return false
    if (filters.difficulty && p.difficulty !== filters.difficulty) return false
    if (filters.priority && p.priority !== filters.priority) return false
    if (filters.urlVerified === true && !p.urlVerified) return false
    if (filters.urlVerified === false && p.urlVerified) return false

    const prog = statusById[p.id]
    const status = prog?.status ?? 'not_attempted'

    if (filters.status && status !== filters.status) return false
    if (filters.needsRevision && status !== 'revision_due') return false
    if (filters.solvedIndependently && !prog?.solvedIndependently && status !== 'solved_independently')
      return false
    if (filters.solvedWithHints && !prog?.solvedWithHints && status !== 'solved_with_hint')
      return false
    if (
      filters.unsolved &&
      !['not_attempted', 'attempted', 'could_not_solve'].includes(status)
    )
      return false

    if (q) {
      const hay = `${p.name} ${p.primaryPattern} ${p.category} ${p.source}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}
