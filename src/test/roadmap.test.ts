import { describe, expect, it } from 'vitest'
import { TOPICS } from '@/content/taxonomy'
import {
  ROADMAP_PHASES,
  balancedTopicPreview,
  topicsForPhase,
} from '@/domain/roadmap'
import type { TopicMeta, TrackId } from '@/domain/types'

function fakeTopic(id: string, track: TrackId): TopicMeta {
  return {
    id,
    track,
    sectionId: `${track}1`,
    sectionTitle: 'Test',
    title: id,
    priority: 'tier1',
    executionPriority: 'p0',
    curriculumLevel: 'classified-item',
    targetMonths: [1, 2],
    prerequisites: [],
    relatedTopics: [],
    nextTopics: [],
    estimatedDepth: 'medium',
    kind: 'theory',
    tags: [],
    contentReady: true,
  }
}

describe('roadmap phases', () => {
  it('uses six non-overlapping two-month phases', () => {
    expect(ROADMAP_PHASES).toHaveLength(6)
    expect(
      ROADMAP_PHASES.flatMap((phase) =>
        Array.from(
          { length: phase.endMonth - phase.startMonth + 1 },
          (_, index) => phase.startMonth + index,
        ),
      ),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('does not duplicate a topic assigned to both months of a phase', () => {
    const phaseOne = topicsForPhase(TOPICS, ROADMAP_PHASES[0])
    expect(new Set(phaseOne.map((topic) => topic.id)).size).toBe(phaseOne.length)
  })

  it('round-robins the default preview across active tracks', () => {
    const topics = (['A', 'B', 'C', 'D', 'E'] as TrackId[]).flatMap((track) =>
      Array.from({ length: 4 }, (_, index) => fakeTopic(`${track}-${index}`, track)),
    )
    const preview = balancedTopicPreview(topics, 10)
    expect(preview.slice(0, 5).map((topic) => topic.track)).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
    ])
    expect(new Set(preview.map((topic) => topic.track)).size).toBe(5)
  })

  it('the real foundation phase includes more than Track A', () => {
    const phaseOne = topicsForPhase(TOPICS, ROADMAP_PHASES[0])
    expect(new Set(phaseOne.map((topic) => topic.track)).size).toBeGreaterThan(1)
  })
})
