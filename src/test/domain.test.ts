import { describe, expect, it } from 'vitest'
import {
  computeNextRevision,
  getRevisionBucket,
} from '@/domain/revision'
import { buildRevisionSchedule } from '@/domain/revision-schedule'
import { filterProblems, PROBLEMS } from '@/content/problems'
import { exportUserState, importUserState, EMPTY_USER_STATE } from '@/lib/import-export'
import {
  getTopicMeta,
  TOPICS,
  SECTIONS,
  curriculumStats,
  getContentReadyTopics,
} from '@/content/taxonomy'
import { getTopicContentSync, preloadAllTopicContent } from '@/content/topics'
import { filterTopics } from '@/domain/progress-selectors'
import { listCustomTopicsFromMap } from '@/domain/user-content'
import { groupSectionsForDisplay } from '@/content/section-display'

const AUTHORITATIVE_SECTION_COUNTS: Record<
  string,
  readonly [tier1: number, tier2: number, tier3: number]
> = {
  A1: [8, 1, 0], A2: [10, 1, 0], A3: [6, 2, 0], A4: [7, 0, 0],
  A5: [7, 0, 0], A6: [10, 2, 0], A7: [5, 1, 0], A8: [8, 5, 0],
  A9: [8, 0, 0], A10: [4, 0, 0], A11: [9, 2, 1], A12: [0, 3, 2],
  A13: [3, 2, 0], A14: [10, 0, 0], 'B1.1': [7, 0, 0], 'B1.2': [7, 1, 0],
  'B1.3': [8, 2, 0], 'B1.4': [3, 1, 0], 'B1.5': [9, 2, 0], 'B1.6': [6, 0, 0],
  'B1.7': [3, 2, 0], 'B1.8': [3, 1, 0], 'B1.9': [9, 2, 0], 'B1.10': [3, 0, 0],
  'B1.11': [2, 0, 0], 'B1.12': [5, 0, 0], 'B1.13': [3, 0, 0], 'B1.14': [1, 2, 0],
  'B1.15': [2, 0, 0], 'B1.16': [5, 0, 0], 'B1.17': [4, 0, 0], 'B1.18': [6, 1, 0],
  'B1.19': [2, 2, 0], 'B1.20': [2, 0, 0], 'B1.21': [0, 1, 0], 'B1.22': [0, 1, 0],
  'B1.23': [1, 0, 0], 'B1.24': [1, 0, 0], 'B1.25': [1, 1, 0], 'B1.26': [3, 0, 0],
  'B1.27': [2, 1, 0], 'B1.28': [2, 0, 0], 'B1.29': [4, 0, 0], 'B1.30': [2, 0, 0],
  'B1.31': [0, 3, 0], 'B1.32': [4, 0, 0], 'B1.33': [4, 0, 0], 'B1.34': [2, 1, 0],
  'B1.35': [1, 1, 0], 'B1.36': [1, 2, 1], 'B1.37': [0, 3, 0], 'B1.38': [1, 1, 0],
  'B1.39': [3, 0, 0], 'B1.40': [2, 1, 0], 'B1.41': [0, 1, 0], 'B1.42': [0, 0, 2],
  'B1.43': [9, 2, 0], 'B2.1': [6, 1, 0], 'B2.2': [3, 0, 0], 'B2.3': [2, 0, 0],
  'B2.4': [3, 0, 0], 'B2.5': [1, 0, 0], 'B2.6': [2, 0, 0], 'B2.7': [2, 0, 0],
  'B2.8': [3, 0, 0], 'B2.9': [2, 0, 0], 'B2.10': [2, 0, 0], 'B2.11': [2, 0, 0],
  'B2.12': [3, 0, 0], 'B2.13': [1, 0, 0], 'B2.14': [2, 1, 0], 'B2.15': [1, 0, 0],
  'B2.16': [1, 0, 0], 'B2.17': [2, 0, 0], 'B2.18': [2, 1, 0], 'B2.19': [2, 0, 0],
  'B2.20': [1, 0, 0], 'B2.21': [4, 0, 0], 'B2.22': [1, 1, 0], 'B2.23': [2, 0, 0],
  'B2.24': [3, 0, 0], 'B2.25': [0, 3, 0], 'B2.26': [0, 3, 0], 'B2.27': [2, 0, 0],
  'B2.28': [3, 0, 0], 'B2.29': [1, 0, 0], 'B2.30': [2, 1, 0], 'B2.31': [3, 0, 0],
  'B2.32': [4, 0, 0], 'B2.33': [1, 1, 0], 'B2.34': [0, 3, 0], 'B2.35': [4, 1, 0],
  'B3.1': [8, 1, 0], 'B3.2': [10, 2, 0], 'B3.3': [8, 1, 0], 'B3.4': [6, 2, 0],
  'B3.5': [5, 1, 0], 'B3.6': [4, 3, 0], 'B3.7': [6, 2, 0], 'B3.8': [5, 2, 0],
  'B3.9': [3, 1, 0], 'B3.10': [6, 0, 0], 'B3.11': [4, 1, 0], 'B3.12': [3, 1, 0],
  'B3.13': [1, 1, 1], 'B3.14': [2, 1, 1], 'B3.15': [5, 1, 0], 'B3.16': [4, 0, 0],
  'B3.17': [3, 1, 0], 'B3.18': [3, 2, 0], 'B3.19': [1, 1, 0], 'B3.20': [5, 1, 0],
  'B3.21': [4, 0, 0], 'B3.22': [0, 2, 2], 'B3.23': [0, 4, 0], 'B3.24': [0, 4, 0],
  'B3.25': [1, 3, 0], 'B3.26': [0, 3, 1], 'B3.27': [6, 0, 0], 'B3.28': [6, 0, 0],
  'B3.29': [4, 1, 0], 'B3.30': [3, 3, 0], 'B3.31': [3, 1, 1], 'B3.32': [4, 1, 0],
  'B3.33': [0, 4, 0], 'B3.34': [0, 4, 4], 'B3.35': [4, 1, 0], 'B3.36': [8, 1, 0],
  'B3.37': [17, 3, 0],
  'B4.1': [7, 0, 0], 'B4.2': [8, 0, 0], 'B4.3': [9, 0, 0],
  'B4.4': [3, 0, 0], 'B4.5': [4, 0, 0], 'B4.6': [12, 1, 0],
  'B4.7': [2, 0, 0], 'B4.8': [3, 0, 0], 'B4.9': [4, 2, 0],
  'B4.10': [2, 0, 0], 'B4.11': [2, 0, 0], 'B4.12': [10, 0, 0],
  'B4.13': [4, 0, 0], 'B4.14': [4, 0, 0], 'B4.15': [4, 1, 0],
  'B4.16': [8, 0, 0], 'B4.17': [6, 0, 0], 'B4.18': [5, 0, 0],
  'B4.19': [0, 1, 0], 'B4.20': [5, 2, 0], 'B4.21': [1, 0, 0],
  'B4.22': [0, 1, 0], 'B4.23': [0, 2, 1], 'B4.24': [4, 0, 0],
  'B5.1': [2, 1, 0], 'B5.2': [2, 0, 0], 'B5.3': [1, 0, 0],
  'B5.4': [1, 0, 0], 'B5.5': [1, 0, 0], 'B5.6': [2, 0, 0],
  'B5.7': [3, 0, 0], 'B5.8': [3, 0, 0], 'B5.9': [1, 0, 0],
  'B5.10': [2, 0, 0], 'B5.11': [1, 1, 0], 'B5.12': [3, 0, 0],
  'B6.1': [3, 0, 0], 'B6.2': [2, 1, 0], 'B6.3': [1, 0, 0],
  'B6.4': [1, 0, 0], 'B6.5': [1, 0, 0], 'B6.6': [1, 0, 0],
  'B6.7': [2, 0, 0], 'B6.8': [1, 0, 0], 'B6.9': [1, 0, 0],
  'B6.10': [2, 0, 0], 'B6.11': [1, 0, 0], 'B6.12': [1, 0, 0],
  'B6.13': [3, 0, 0], 'B6.14': [2, 0, 0],
  'C1.1': [2, 1, 0], 'C1.2': [2, 0, 0], 'C1.3': [2, 0, 0],
  'C1.4': [2, 0, 0], 'C1.5': [3, 0, 0], 'C1.6': [3, 0, 0],
  'C1.7': [3, 0, 0], 'C1.8': [2, 0, 0], 'C1.9': [1, 0, 0],
  'C1.10': [2, 0, 0], 'C1.11': [1, 0, 0], 'C1.12': [1, 0, 0],
  'C1.13': [5, 0, 0], 'C1.14': [4, 1, 0], 'C1.15': [2, 0, 0],
  'C1.16': [2, 3, 0],
  'C2.1': [1, 0, 0], 'C2.2': [1, 0, 0], 'C2.3': [1, 1, 0],
  'C2.4': [1, 0, 0], 'C2.5': [1, 0, 0], 'C2.6': [1, 0, 0],
  'C2.7': [1, 0, 0], 'C2.8': [2, 0, 0], 'C2.9': [1, 0, 0],
  'C2.10': [1, 1, 0], 'C2.11': [0, 2, 0], 'C2.12': [0, 1, 0],
  'C3.1': [2, 0, 0], 'C3.2': [1, 0, 0], 'C3.3': [1, 0, 0],
  'C3.4': [2, 0, 0], 'C3.5': [1, 0, 0], 'C3.6': [1, 0, 0],
  'C3.7': [1, 0, 0], 'C3.8': [1, 0, 0], 'C3.9': [1, 0, 0],
  'C3.10': [1, 0, 0], 'C3.11': [2, 0, 0], 'C3.12': [2, 0, 0],
  'C3.13': [0, 1, 0], 'C3.14': [2, 0, 0], 'C3.15': [1, 0, 0],
  'C3.16': [0, 2, 0],
  'C3.17': [0, 1, 0],
  'C4.1': [2, 0, 0], 'C4.2': [0, 1, 1], 'C4.3': [0, 1, 0],
  'C4.4': [1, 0, 0], 'C4.5': [1, 0, 0], 'C4.6': [1, 0, 0],
  'C4.7': [1, 0, 0], 'C4.8': [1, 0, 0], 'C4.9': [1, 0, 0],
  'C4.10': [1, 0, 0], 'C4.11': [2, 0, 0], 'C4.12': [0, 2, 0],
  'C4.13': [3, 0, 0], 'C4.14': [3, 0, 0], 'C4.15': [2, 1, 0],
  'C4.16': [1, 0, 0], 'C4.17': [0, 1, 0], 'C4.18': [2, 0, 0],
  'C4.19': [1, 0, 0],
  'C5.1': [1, 0, 0], 'C5.2': [1, 0, 0], 'C5.3': [1, 0, 0],
  'C5.4': [1, 0, 0], 'C5.5': [1, 0, 0], 'C5.6': [1, 0, 0],
  'C5.7': [1, 0, 0], 'C5.8': [1, 0, 0], 'C5.9': [1, 0, 0],
  'C5.10': [1, 0, 0], 'C5.11': [0, 1, 0], 'C5.12': [0, 1, 0],
  'C5.13': [0, 1, 0], 'C5.14': [1, 0, 0],
  'C6.1': [1, 0, 0], 'C6.2': [1, 0, 0], 'C6.3': [1, 0, 0],
  'C6.4': [1, 0, 0], 'C6.5': [1, 0, 0], 'C6.6': [1, 0, 0],
  'C6.7': [1, 0, 0], 'C6.8': [1, 0, 0], 'C6.9': [1, 0, 0],
  'C6.10': [1, 0, 0], 'C6.11': [1, 0, 0], 'C6.12': [0, 1, 0],
  'C6.13': [1, 0, 0], 'C6.14': [1, 0, 0], 'C6.15': [0, 1, 0],
  'C6.16': [1, 0, 0], 'C6.17': [1, 0, 0], 'C6.18': [1, 0, 0],
  'C6.19': [0, 1, 0], 'C6.20': [1, 0, 0],
  'C7.1': [1, 0, 0], 'C7.2': [1, 0, 0], 'C7.3': [1, 0, 0],
  'C7.4': [1, 0, 0], 'C7.5': [1, 0, 0], 'C7.6': [1, 0, 0],
  'C7.7': [1, 0, 0], 'C7.8': [1, 0, 0], 'C7.9': [2, 0, 0],
  'C7.10': [1, 0, 0], 'C7.11': [2, 0, 0], 'C7.12': [3, 0, 0],
  'C7.13': [3, 0, 0], 'C7.14': [3, 0, 0], 'C7.15': [3, 0, 0],
  'C7.16': [1, 0, 0], 'C7.17': [0, 1, 0], 'C7.18': [1, 0, 0],
  'C7.19': [0, 1, 0], 'C7.20': [0, 1, 0],
  C8: [12, 0, 0],
  C9: [14, 0, 0], C10: [6, 4, 0], C11: [13, 4, 0], C12: [12, 0, 0],
  C13: [6, 3, 0], C14: [12, 1, 1], C15: [8, 7, 1], C16: [9, 2, 0],
  D1: [7, 0, 0], D2: [7, 5, 1], D3: [12, 2, 0], D4: [17, 5, 1],
  D5: [17, 0, 0], D6: [9, 4, 0], D7: [13, 0, 0], D8: [6, 1, 0],
  D9: [13, 0, 0], D10: [15, 2, 0], E1: [8, 2, 0], E2: [12, 3, 0],
  E3: [11, 0, 0], E4: [7, 1, 0], E5: [6, 2, 0], E6: [12, 0, 0],
  E7: [10, 1, 0], E8: [0, 1, 0], E9: [8, 2, 0], E10: [16, 0, 0],
  E11: [8, 1, 0], E12: [6, 2, 0],
}

describe('revision engine', () => {
  it('schedules next revision from status', () => {
    const from = new Date('2026-08-17T12:00:00Z')
    const learning = computeNextRevision('learning', 3, from)
    expect(learning).toBeTruthy()
    expect(new Date(learning!).getTime()).toBeGreaterThan(from.getTime())

    const needs = computeNextRevision('needs_revision', 2, from)
    expect(new Date(needs!).getTime()).toBeLessThan(from.getTime())
  })

  it('buckets due dates', () => {
    const now = new Date('2026-08-17T15:00:00Z')
    expect(getRevisionBucket(undefined, now)).toBe('none')
    expect(getRevisionBucket('2026-08-16T10:00:00Z', now)).toBe('overdue')
    expect(getRevisionBucket('2026-08-17T18:00:00Z', now)).toBe('due_today')
    expect(getRevisionBucket('2026-08-20T18:00:00Z', now)).toBe('this_week')
  })

  it('populates the Memora default calendar from a study date', () => {
    const studied = new Date(2026, 5, 22)
    const slots = buildRevisionSchedule(studied)
    const byId = Object.fromEntries(slots.map((slot) => [slot.id, slot.date]))

    expect(byId.rev1).toBe('2026-06-22')
    expect(byId.rev2).toBe('2026-06-23')
    expect(byId.rev3).toBe('2026-06-24')
    expect(byId.rev4).toBe('2026-06-28')
    expect(byId.rev5).toBe('2026-07-05')
    expect(byId.rev6).toBe('2026-07-26')
    expect(byId.rev7).toBe('2026-09-24')
    expect(slots).toHaveLength(7)
  })
})

describe('Phase 3 DSA indexes', () => {
  it('includes full NeetCode 250 and CSES 400 with unique ids', () => {
    expect(PROBLEMS.filter((p) => p.source === 'neetcode250')).toHaveLength(250)
    expect(PROBLEMS.filter((p) => p.source === 'cses')).toHaveLength(400)
    expect(PROBLEMS).toHaveLength(650)
    expect(new Set(PROBLEMS.map((p) => p.id)).size).toBe(650)
    expect(PROBLEMS.every((p) => p.sourceUrl && p.category && p.listOrder > 0)).toBe(true)
    expect(PROBLEMS.filter((p) => p.source === 'neetcode250').every((p) => p.urlVerified)).toBe(
      true,
    )
    expect(PROBLEMS.filter((p) => p.source === 'cses').every((p) => p.urlVerified)).toBe(true)
  })

  it('filters by source, category, and query', () => {
    const cses = filterProblems(PROBLEMS, { source: 'cses' }, {})
    expect(cses).toHaveLength(400)
    expect(cses.every((p) => p.source === 'cses')).toBe(true)

    const sw = filterProblems(PROBLEMS, { category: 'sliding-window' }, {})
    expect(sw.length).toBeGreaterThan(0)
    expect(sw.every((p) => p.category === 'sliding-window')).toBe(true)

    const named = filterProblems(PROBLEMS, { query: 'minimum window' }, {})
    expect(named.some((p) => p.name.includes('Minimum Window'))).toBe(true)
  })

  it('filters unsolved', () => {
    const statusById = {
      [PROBLEMS[0].id]: { status: 'solved_independently', solvedIndependently: true },
    }
    const unsolved = filterProblems(PROBLEMS, { unsolved: true }, statusById)
    expect(unsolved.find((p) => p.id === PROBLEMS[0].id)).toBeUndefined()
  })
})

describe('import/export', () => {
  it('round-trips user state', () => {
    const state = {
      ...EMPTY_USER_STATE,
      topics: {
        'a2-sliding-window': {
          status: 'learning' as const,
          confidence: 3 as const,
          revisionCount: 0,
        },
      },
      notes: { 'a2-sliding-window': 'practice more' },
      topicOverlays: {
        'a2-sliding-window': { keyTakeaways: ['edge: empty window'] },
      },
      customTopics: {
        'custom-demo-abc': {
          id: 'custom-demo-abc',
          title: 'Demo custom',
          track: 'A' as const,
          sectionTitle: 'My Topics',
          priority: 'tier2' as const,
          executionPriority: 'p2' as const,
          targetMonths: [1],
          tags: ['custom'],
          keyTakeaways: ['point a'],
          quickRevision: ['rev a'],
          createdAt: '2026-08-17T00:00:00.000Z',
          updatedAt: '2026-08-17T00:00:00.000Z',
        },
      },
    }
    const json = exportUserState(state)
    const restored = importUserState(json)
    expect(restored.topics['a2-sliding-window']?.status).toBe('learning')
    expect(restored.notes['a2-sliding-window']).toBe('practice more')
    expect(restored.topicOverlays['a2-sliding-window']?.keyTakeaways).toEqual([
      'edge: empty window',
    ])
    expect(restored.customTopics['custom-demo-abc']?.title).toBe('Demo custom')
  })

  it('lists custom topics even when the map is missing', () => {
    expect(listCustomTopicsFromMap(undefined)).toEqual([])
    expect(listCustomTopicsFromMap({})).toEqual([])
  })

  it('rejects bad version', () => {
    expect(() => importUserState(JSON.stringify({ version: 99 }))).toThrow()
  })
})

describe('Phase 2 curriculum hierarchy', () => {
  it('includes full A–E topic list with unique ids', () => {
    const stats = curriculumStats()
    expect(stats.total).toBe(1310)
    expect(stats.sections).toBe(328)
    expect(stats.byTier).toEqual({ tier1: 1061, tier2: 227, tier3: 22 })
    expect(stats.byTrack).toEqual({ A: 117, B: 647, C: 290, D: 137, E: 119 })
    expect(new Set(TOPICS.map((t) => t.id)).size).toBe(TOPICS.length)
    expect(SECTIONS.length).toBe(stats.sections)
  })

  it('matches every authoritative section count and keeps nested concepts attached', () => {
    expect(Object.keys(AUTHORITATIVE_SECTION_COUNTS)).toHaveLength(328)

    for (const [sectionId, expected] of Object.entries(
      AUTHORITATIVE_SECTION_COUNTS,
    )) {
      const topics = TOPICS.filter(
        (topic) =>
          topic.sectionId === sectionId &&
          topic.curriculumLevel === 'classified-item',
      )
      const actual = (['tier1', 'tier2', 'tier3'] as const).map(
        (priority) =>
          topics.filter((topic) => topic.priority === priority).length,
      )
      expect(actual, sectionId).toEqual(expected)
    }

    for (const topic of TOPICS.filter(
      (candidate) => candidate.curriculumLevel === 'nested-concept',
    )) {
      const parent = getTopicMeta(topic.parentTopicId!)
      expect(parent, topic.id).toBeTruthy()
      expect(parent?.sectionId, topic.id).toBe(topic.sectionId)
      expect(parent?.curriculumLevel, topic.id).toBe('classified-item')
    }
  })

  it('models React as 24 deep sections with nested atomic concepts', () => {
    const reactSections = SECTIONS.filter((section) => /^B4\.\d+$/.test(section.id))
    const reactTopics = TOPICS.filter((topic) => topic.sectionId.startsWith('B4.'))
    const classified = reactTopics.filter(
      (topic) => topic.curriculumLevel === 'classified-item',
    )
    const nested = reactTopics.filter(
      (topic) => topic.curriculumLevel === 'nested-concept',
    )

    expect(reactSections).toHaveLength(24)
    expect(reactTopics).toHaveLength(439)
    expect(classified).toHaveLength(118)
    expect(nested).toHaveLength(321)
    expect(getTopicMeta('b4-fiber')?.sectionId).toBe('B4.3')
    expect(getTopicMeta('b4-use-action-state')?.sectionId).toBe('B4.17')
    expect(getTopicMeta('b4-testing-library')?.sectionId).toBe('B4.20')

    const reactGroup = groupSectionsForDisplay(SECTIONS).find((group) => group.id === 'B4')
    expect(reactGroup?.title).toBe('React')
    expect(reactGroup?.sections).toHaveLength(24)
  })

  it('models CSS as 12 deep sections with nested atomic concepts', () => {
    const cssSections = SECTIONS.filter((section) => /^B5\.\d+$/.test(section.id))
    const cssTopics = TOPICS.filter((topic) => topic.sectionId.startsWith('B5.'))
    const classified = cssTopics.filter(
      (topic) => topic.curriculumLevel === 'classified-item',
    )
    const nested = cssTopics.filter(
      (topic) => topic.curriculumLevel === 'nested-concept',
    )

    expect(cssSections).toHaveLength(12)
    expect(cssTopics).toHaveLength(78)
    expect(classified).toHaveLength(24)
    expect(nested).toHaveLength(54)
    expect(getTopicMeta('b5-stacking-context')?.sectionId).toBe('B5.6')
    expect(getTopicMeta('b5-container-queries')?.sectionId).toBe('B5.8')
    expect(getTopicMeta('b5-custom-properties')?.sectionId).toBe('B5.9')

    const cssGroup = groupSectionsForDisplay(SECTIONS).find((group) => group.id === 'B5')
    expect(cssGroup?.title).toBe('CSS / UI Engineering')
    expect(cssGroup?.sections).toHaveLength(12)
  })

  it('models frontend system design as 14 deep sections with nested atoms', () => {
    const fsdSections = SECTIONS.filter((section) => /^B6\.\d+$/.test(section.id))
    const fsdTopics = TOPICS.filter((topic) => topic.sectionId.startsWith('B6.'))
    const classified = fsdTopics.filter(
      (topic) => topic.curriculumLevel === 'classified-item',
    )
    const nested = fsdTopics.filter(
      (topic) => topic.curriculumLevel === 'nested-concept',
    )

    expect(fsdSections).toHaveLength(14)
    expect(fsdTopics).toHaveLength(121)
    expect(classified).toHaveLength(23)
    expect(nested).toHaveLength(98)
    expect(getTopicMeta('b6-radio-framework')?.sectionId).toBe('B6.1')
    expect(getTopicMeta('b6-infinite-scrolling')?.sectionId).toBe('B6.7')
    expect(getTopicMeta('b6-practice-google-docs')?.parentTopicId).toBe('b6-hld-practice')
    expect(getTopicMeta('b6-widget-autocomplete')?.parentTopicId).toBe(
      'b6-component-architecture',
    )

    const fsdGroup = groupSectionsForDisplay(SECTIONS).find((group) => group.id === 'B6')
    expect(fsdGroup?.title).toBe('Frontend System Design')
    expect(fsdGroup?.sections).toHaveLength(14)
  })

  it('models Core Java as 16 deep sections with nested atomic concepts', () => {
    const javaSections = SECTIONS.filter((section) => /^C1\.\d+$/.test(section.id))
    const javaTopics = TOPICS.filter((topic) => topic.sectionId.startsWith('C1.'))
    const classified = javaTopics.filter(
      (topic) => topic.curriculumLevel === 'classified-item',
    )
    const nested = javaTopics.filter(
      (topic) => topic.curriculumLevel === 'nested-concept',
    )

    expect(javaSections).toHaveLength(16)
    expect(javaTopics).toHaveLength(113)
    expect(classified).toHaveLength(42)
    expect(nested).toHaveLength(71)
    expect(getTopicMeta('c1-string-pool')?.sectionId).toBe('C1.4')
    expect(getTopicMeta('c1-hashmap-internals')?.sectionId).toBe('C1.13')
    expect(getTopicMeta('c1-interfaces')?.parentTopicId).toBe('c1-classes')
    expect(getTopicMeta('c1-hashcode')?.parentTopicId).toBe('c1-equals')

    const javaGroup = groupSectionsForDisplay(SECTIONS).find((group) => group.id === 'C1')
    expect(javaGroup?.title).toBe('Core Java')
    expect(javaGroup?.sections).toHaveLength(16)
  })

  it('models JVM as 12 deep sections with modern runtime concepts', () => {
    const jvmSections = SECTIONS.filter((section) => /^C2\.\d+$/.test(section.id))
    const jvmTopics = TOPICS.filter((topic) => topic.sectionId.startsWith('C2.'))
    const classified = jvmTopics.filter(
      (topic) => topic.curriculumLevel === 'classified-item',
    )
    const nested = jvmTopics.filter(
      (topic) => topic.curriculumLevel === 'nested-concept',
    )

    expect(jvmSections).toHaveLength(12)
    expect(jvmTopics).toHaveLength(82)
    expect(classified).toHaveLength(16)
    expect(nested).toHaveLength(66)
    expect(getTopicMeta('c2-jvm-jdk-jre')?.sectionId).toBe('C2.1')
    expect(getTopicMeta('c2-class-loading')?.sectionId).toBe('C2.4')
    expect(getTopicMeta('c2-thread-dumps')?.parentTopicId).toBe('c2-heap-dumps')
    expect(getTopicMeta('c2-zgc')?.parentTopicId).toBe('c2-gc-collectors')

    const jvmGroup = groupSectionsForDisplay(SECTIONS).find((group) => group.id === 'C2')
    expect(jvmGroup?.title).toBe('JVM')
    expect(jvmGroup?.sections).toHaveLength(12)
  })

  it('models Java concurrency as 17 deep sections including modern Loom concepts', () => {
    const concurrencySections = SECTIONS.filter((section) => /^C3\.\d+$/.test(section.id))
    const concurrencyTopics = TOPICS.filter((topic) => topic.sectionId.startsWith('C3.'))
    const classified = concurrencyTopics.filter(
      (topic) => topic.curriculumLevel === 'classified-item',
    )
    const nested = concurrencyTopics.filter(
      (topic) => topic.curriculumLevel === 'nested-concept',
    )

    expect(concurrencySections).toHaveLength(17)
    expect(concurrencyTopics).toHaveLength(142)
    expect(classified).toHaveLength(23)
    expect(nested).toHaveLength(119)
    expect(getTopicMeta('c3-happens-before')?.sectionId).toBe('C3.4')
    expect(getTopicMeta('c3-synchronized')?.parentTopicId).toBe('c3-synchronization')
    expect(getTopicMeta('c3-virtual-threads')?.sectionId).toBe('C3.15')
    expect(getTopicMeta('c3-structured-concurrency')?.priority).toBe('tier2')

    const group = groupSectionsForDisplay(SECTIONS).find((candidate) => candidate.id === 'C3')
    expect(group?.title).toBe('Java Concurrency')
    expect(group?.sections).toHaveLength(17)
  })

  it('models Networking & Web as 19 layered sections with Java networking APIs', () => {
    const networkingSections = SECTIONS.filter((section) => /^C4\.\d+$/.test(section.id))
    const networkingTopics = TOPICS.filter((topic) => topic.sectionId.startsWith('C4.'))
    const classified = networkingTopics.filter(
      (topic) => topic.curriculumLevel === 'classified-item',
    )
    const nested = networkingTopics.filter(
      (topic) => topic.curriculumLevel === 'nested-concept',
    )

    expect(networkingSections).toHaveLength(19)
    expect(networkingTopics).toHaveLength(203)
    expect(classified).toHaveLength(30)
    expect(nested).toHaveLength(173)
    expect(getTopicMeta('c4-tcp-handshake')?.sectionId).toBe('C4.7')
    expect(getTopicMeta('c4-https')?.parentTopicId).toBe('c4-tls')
    expect(getTopicMeta('c4-http3')?.sectionId).toBe('C4.12')
    expect(getTopicMeta('c4-url-request-lifecycle')?.sectionId).toBe('C4.18')
    expect(getTopicMeta('c4-java-httpclient')?.sectionId).toBe('C4.19')

    const group = groupSectionsForDisplay(SECTIONS).find((candidate) => candidate.id === 'C4')
    expect(group?.title).toBe('Networking & Web')
    expect(group?.sections).toHaveLength(19)
  })

  it('models Spring Core as 14 deep sections covering container, DI, AOP and tests', () => {
    const springSections = SECTIONS.filter((section) => /^C5\.\d+$/.test(section.id))
    const springTopics = TOPICS.filter((topic) => topic.sectionId.startsWith('C5.'))
    const classified = springTopics.filter(
      (topic) => topic.curriculumLevel === 'classified-item',
    )
    const nested = springTopics.filter(
      (topic) => topic.curriculumLevel === 'nested-concept',
    )

    expect(springSections).toHaveLength(14)
    expect(springTopics).toHaveLength(86)
    expect(classified).toHaveLength(14)
    expect(nested).toHaveLength(72)
    expect(getTopicMeta('c5-constructor-injection')?.parentTopicId).toBe('c5-di')
    expect(getTopicMeta('c5-constructor-injection')?.sectionId).toBe('C5.3')
    expect(getTopicMeta('c5-aop')?.sectionId).toBe('C5.11')
    expect(getTopicMeta('c5-proxies')?.priority).toBe('tier2')
    expect(getTopicMeta('c5-circular-dependencies')?.sectionId).toBe('C5.9')

    const group = groupSectionsForDisplay(SECTIONS).find((candidate) => candidate.id === 'C5')
    expect(group?.title).toBe('Spring Core')
    expect(group?.sections).toHaveLength(14)
  })

  it('models Spring Boot as 20 modern sections without duplicating adjacent tracks', () => {
    const bootSections = SECTIONS.filter((section) => /^C6\.\d+$/.test(section.id))
    const bootTopics = TOPICS.filter((topic) => topic.sectionId.startsWith('C6.'))
    const classified = bootTopics.filter(
      (topic) => topic.curriculumLevel === 'classified-item',
    )
    const nested = bootTopics.filter(
      (topic) => topic.curriculumLevel === 'nested-concept',
    )

    expect(bootSections).toHaveLength(20)
    expect(bootTopics).toHaveLength(177)
    expect(classified).toHaveLength(20)
    expect(nested).toHaveLength(157)
    expect(getTopicMeta('c6-auto-configuration')?.sectionId).toBe('C6.3')
    expect(getTopicMeta('c6-restclient')?.parentTopicId).toBe('c6-http-clients')
    expect(getTopicMeta('c6-mockito-bean')?.sectionId).toBe('C6.18')
    expect(getTopicMeta('c6-resttemplate-legacy')?.priority).toBe('tier2')
    expect(getTopicMeta('c6-aot-native')?.sectionId).toBe('C6.19')

    const group = groupSectionsForDisplay(SECTIONS).find((candidate) => candidate.id === 'C6')
    expect(group?.title).toBe('Spring Boot')
    expect(group?.sections).toHaveLength(20)
  })

  it('models SQL and PostgreSQL as 20 sections from relational semantics to operations', () => {
    const sqlSections = SECTIONS.filter((section) => /^C7\.\d+$/.test(section.id))
    const sqlTopics = TOPICS.filter((topic) => topic.sectionId.startsWith('C7.'))
    const classified = sqlTopics.filter(
      (topic) => topic.curriculumLevel === 'classified-item',
    )
    const nested = sqlTopics.filter(
      (topic) => topic.curriculumLevel === 'nested-concept',
    )

    expect(sqlSections).toHaveLength(20)
    expect(sqlTopics).toHaveLength(245)
    expect(classified).toHaveLength(30)
    expect(nested).toHaveLength(215)
    expect(getTopicMeta('c7-crud')?.sectionId).toBe('C7.5')
    expect(getTopicMeta('c7-leftmost-prefix')?.parentTopicId).toBe('c7-composite-indexes')
    expect(getTopicMeta('c7-serializable-ssi')?.sectionId).toBe('C7.12')
    expect(getTopicMeta('c7-json-jsonb')?.sectionId).toBe('C7.16')
    expect(getTopicMeta('c7-partitioning')?.priority).toBe('tier2')

    const group = groupSectionsForDisplay(SECTIONS).find((candidate) => candidate.id === 'C7')
    expect(group?.title).toBe('SQL & PostgreSQL')
    expect(group?.sections).toHaveLength(20)
  })

  it('marks Phase 4 deep topics contentReady from modules', () => {
    const ready = getContentReadyTopics()
    expect(ready.length).toBe(TOPICS.length)
    expect(TOPICS.every((t) => t.contentReady)).toBe(true)
    expect(getTopicMeta('c7-isolation-levels')?.contentReady).toBe(true)
    expect(getTopicMeta('a2-sliding-window')?.contentReady).toBe(true)
    expect(getTopicMeta('a2-two-pointers')?.contentReady).toBe(true)
    expect(getTopicMeta('a2-kadane')?.contentReady).toBe(true)
    expect(getTopicMeta('b1-event-loop')?.contentReady).toBe(true)
    expect(getTopicMeta('c1-hashmap-internals')?.contentReady).toBe(true)
    expect(getTopicMeta('d4-cap')?.contentReady).toBe(true)
    expect(getTopicMeta('d10-rate-limiter')?.contentReady).toBe(true)
  })

  it('assigns tier, months, and relationships on exemplars', () => {
    const iso = getTopicMeta('c7-isolation-levels')!
    expect(iso.priority).toBe('tier1')
    expect(iso.targetMonths).toContain(3)
    expect(iso.prerequisites.length).toBeGreaterThan(0)
    expect(iso.usedInCapstone).toBeTruthy()
  })

  it('filters roadmap topics by track', () => {
    const filtered = filterTopics({
      track: 'A',
      state: EMPTY_USER_STATE,
    })
    expect(filtered.every((t) => t.track === 'A')).toBe(true)
    expect(filtered.length).toBeGreaterThan(80)
  })
})

describe('Phase 4 deep content', () => {
  it('registers content modules with required revision surfaces', async () => {
    await preloadAllTopicContent()
    const ready = getContentReadyTopics()
    expect(ready.length).toBe(TOPICS.length)
    for (const t of ready) {
      const c = getTopicContentSync(t.id)
      expect(c, t.id).toBeTruthy()
      expect(c!.keyTakeaways.length, t.id).toBeGreaterThan(0)
      expect(c!.quickRevision.length, t.id).toBeGreaterThan(0)
      expect(c!.flashcards.length, t.id).toBeGreaterThan(0)
      expect(c!.interviewQuestions.length, t.id).toBeGreaterThan(0)
    }
  }, 120_000)
})
