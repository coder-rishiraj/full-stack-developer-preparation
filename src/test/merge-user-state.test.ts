import { describe, expect, it } from 'vitest'
import { hasMeaningfulProgress, mergeUserStates } from '@/domain/merge-user-state'
import { EMPTY_USER_STATE } from '@/lib/import-export'
import { normalizeUserState } from '@/stores/user-store'
import type { ProblemProgress, UserState } from '@/domain/types'

function state(patch: Partial<UserState>): UserState {
  return { ...structuredClone(EMPTY_USER_STATE), ...patch }
}

function problem(patch: Partial<ProblemProgress>): ProblemProgress {
  return {
    status: 'attempted',
    attempts: 1,
    solvedIndependently: false,
    solvedWithHints: false,
    solutionViewed: false,
    revisionCount: 0,
    confidence: 1,
    attemptHistory: [],
    ...patch,
  }
}

describe('guest → account progress merge', () => {
  it('treats an empty or prefs-only state as having no progress', () => {
    expect(hasMeaningfulProgress(state({}))).toBe(false)
    expect(hasMeaningfulProgress(state({ theme: 'dark', recentTopics: ['a'] }))).toBe(false)
    expect(hasMeaningfulProgress(state({ bookmarks: ['x'] }))).toBe(true)
  })

  it('keeps the more recent / more advanced topic record and unions lists', () => {
    const account = state({
      theme: 'nord',
      topics: {
        t1: { status: 'first_pass', confidence: 3, revisionCount: 0, lastStudied: '2026-01-01T00:00:00Z' },
        t2: { status: 'not_started', confidence: 1, revisionCount: 0 },
      },
      bookmarks: ['a'],
      notes: { n1: 'cloud note' },
    })
    const guest = state({
      theme: 'dark',
      topics: {
        t1: { status: 'learning', confidence: 2, revisionCount: 0, lastStudied: '2026-02-01T00:00:00Z' },
        t2: { status: 'learning', confidence: 1, revisionCount: 0, lastStudied: '2025-01-01T00:00:00Z' },
        t3: { status: 'interview_ready', confidence: 5, revisionCount: 2 },
      },
      bookmarks: ['a', 'b'],
      notes: { n1: 'device note', n2: 'only here' },
    })
    const merged = mergeUserStates(account, guest)
    expect(merged.theme).toBe('nord')
    expect(merged.topics.t1.status).toBe('learning')
    expect(merged.topics.t2.status).toBe('learning')
    expect(merged.topics.t3.status).toBe('interview_ready')
    expect(merged.bookmarks).toEqual(['a', 'b'])
    expect(merged.notes.n1).toBe('cloud note\n\ndevice note')
    expect(merged.notes.n2).toBe('only here')
  })

  it('combines problem attempt history and solved flags', () => {
    const account = state({
      problems: {
        p: problem({
          status: 'solved_with_hint',
          solvedWithHints: true,
          lastAttempted: '2026-03-01T00:00:00Z',
          attemptHistory: [{ at: '2026-03-01T00:00:00Z', outcome: 'solved_with_hint' }],
        }),
      },
    })
    const guest = state({
      problems: {
        p: problem({
          status: 'solved_independently',
          solvedIndependently: true,
          lastAttempted: '2026-04-01T00:00:00Z',
          attemptHistory: [{ at: '2026-04-01T00:00:00Z', outcome: 'solved_independently' }],
        }),
      },
    })
    const merged = mergeUserStates(account, guest).problems.p
    expect(merged.status).toBe('solved_independently')
    expect(merged.solvedIndependently && merged.solvedWithHints).toBe(true)
    expect(merged.attemptHistory.map((h) => h.outcome)).toEqual(['solved_with_hint', 'solved_independently'])
    expect(merged.attempts).toBe(2)
  })

  it('normalizes partial cloud documents with defaults', () => {
    const normalized = normalizeUserState({ topics: { t: { status: 'learning', confidence: 2, revisionCount: 0 } } })
    expect(normalized.bookmarks).toEqual([])
    expect(normalized.reading).toEqual(EMPTY_USER_STATE.reading)
    expect(normalized.topics.t.status).toBe('learning')
  })
})
