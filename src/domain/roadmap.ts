import type { TopicMeta, TrackId } from '@/domain/types'

export type RoadmapPhase = {
  id: number
  startMonth: number
  endMonth: number
  title: string
  focus: string
  outcome: string
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 1,
    startMonth: 1,
    endMonth: 2,
    title: 'Foundations',
    focus: 'DSA foundations, Core Java, JavaScript fundamentals, OOD, and early HLD',
    outcome: 'Build reliable coding habits and complete the first pass of core language fundamentals.',
  },
  {
    id: 2,
    startMonth: 3,
    endMonth: 4,
    title: 'Core engineering depth',
    focus: 'Graphs and DP, Spring, PostgreSQL, TypeScript, browser internals, and LLD',
    outcome: 'Solve medium interview problems and explain an end-to-end web request confidently.',
  },
  {
    id: 3,
    startMonth: 5,
    endMonth: 6,
    title: 'Production systems',
    focus: 'DSA mastery, Redis, Kafka, React depth, distributed systems, and HLD',
    outcome: 'Design and reason about scalable production features with explicit trade-offs.',
  },
  {
    id: 4,
    startMonth: 7,
    endMonth: 8,
    title: 'Delivery and interview execution',
    focus: 'Timed DSA, Docker, AWS, observability, mock interviews, and capstone deployment',
    outcome: 'Deploy the capstone and perform consistently under timed interview constraints.',
  },
  {
    id: 5,
    startMonth: 9,
    endMonth: 10,
    title: 'Interview readiness and Applied AI',
    focus: 'Weak-area revision, system-design mocks, applications, and Applied AI foundations',
    outcome: 'Reach interview-ready status in core tracks and add one practical AI feature.',
  },
  {
    id: 6,
    startMonth: 11,
    endMonth: 12,
    title: 'Targeted revision and applications',
    focus: 'Company-specific preparation, mocks, referrals, interviews, and negotiation',
    outcome: 'Drive preparation from real interview feedback and close the remaining weak areas.',
  },
]

const TRACK_ORDER: TrackId[] = ['A', 'B', 'C', 'D', 'E']

export function phaseForMonth(month: number): RoadmapPhase {
  const phase = ROADMAP_PHASES.find(
    (candidate) => month >= candidate.startMonth && month <= candidate.endMonth,
  )
  if (!phase) throw new Error(`No roadmap phase for month ${month}`)
  return phase
}

/**
 * A topic belongs to the phase containing its first target month. Remaining
 * months describe its study window, but do not duplicate it across phases.
 */
export function topicsForPhase(topics: TopicMeta[], phase: RoadmapPhase): TopicMeta[] {
  return topics.filter((topic) => {
    const scheduledMonth = Math.min(...topic.targetMonths)
    return (
      scheduledMonth >= phase.startMonth &&
      scheduledMonth <= phase.endMonth
    )
  })
}

/**
 * Selects a track-balanced preview instead of taking taxonomy order (A then B…).
 * Within each track, Tier 1 comes first while round-robin selection keeps every
 * scheduled track visible.
 */
export function balancedTopicPreview(
  topics: TopicMeta[],
  limit = 20,
  tier1Only = true,
): TopicMeta[] {
  const eligible = tier1Only
    ? topics.filter((topic) => topic.priority === 'tier1')
    : topics
  const queues = new Map(
    TRACK_ORDER.map((track) => [
      track,
      eligible.filter((topic) => topic.track === track),
    ]),
  )
  const result: TopicMeta[] = []

  while (result.length < limit) {
    let added = false
    for (const track of TRACK_ORDER) {
      const next = queues.get(track)?.shift()
      if (!next) continue
      result.push(next)
      added = true
      if (result.length === limit) break
    }
    if (!added) break
  }

  return result
}

export function countTopicsByTrack(topics: TopicMeta[]): Record<TrackId, number> {
  return Object.fromEntries(
    TRACK_ORDER.map((track) => [
      track,
      topics.filter((topic) => topic.track === track).length,
    ]),
  ) as Record<TrackId, number>
}
