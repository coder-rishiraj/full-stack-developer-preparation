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
  'B3.37': [17, 3, 0], B4: [36, 1, 0], B5: [9, 2, 0], B6: [15, 0, 0],
  C1: [24, 1, 0], C2: [6, 5, 0], C3: [17, 2, 0], C4: [15, 3, 0],
  C5: [9, 2, 0], C6: [14, 0, 0], C7: [21, 2, 0], C8: [12, 0, 0],
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
    expect(stats.total).toBe(1154)
    expect(stats.sections).toBe(170)
    expect(stats.byTier).toEqual({ tier1: 931, tier2: 203, tier3: 20 })
    expect(stats.byTrack).toEqual({ A: 117, B: 545, C: 236, D: 137, E: 119 })
    expect(new Set(TOPICS.map((t) => t.id)).size).toBe(TOPICS.length)
    expect(SECTIONS.length).toBe(stats.sections)
  })

  it('matches every authoritative section count and keeps nested concepts attached', () => {
    expect(Object.keys(AUTHORITATIVE_SECTION_COUNTS)).toHaveLength(170)

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
