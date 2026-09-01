import type {
  CurriculumLevel,
  EstimatedDepth,
  ExecutionPriority,
  Priority,
  TopicKind,
  TopicMeta,
  TrackId,
} from '@/domain/types'

/** Compact seed used to generate TopicMeta without repeating section fields. */
export type TopicSeed = {
  id: string
  title: string
  priority: Priority
  executionPriority?: ExecutionPriority
  curriculumLevel?: CurriculumLevel
  parentTopicId?: string
  months: number[]
  kind?: TopicKind
  depth?: EstimatedDepth
  tags?: string[]
  prereqs?: string[]
  related?: string[]
  next?: string[]
  capstone?: string
  contentReady?: boolean
}

export type SectionSeed = {
  id: string
  track: TrackId
  title: string
  order: number
  defaultKind: TopicKind
  defaultDepth: EstimatedDepth
  topics: TopicSeed[]
}

function defaultExecutionPriority(
  track: TrackId,
  knowledgePriority: Priority,
): ExecutionPriority {
  if (track === 'E') return 'later'
  if (track === 'B') {
    if (knowledgePriority === 'tier1') return 'p1'
    if (knowledgePriority === 'tier2') return 'p2'
    return 'later'
  }
  if (knowledgePriority === 'tier1') return 'p0'
  if (knowledgePriority === 'tier2') return 'p1'
  return 'p2'
}

export function expandSections(sections: SectionSeed[]): TopicMeta[] {
  const topics: TopicMeta[] = []
  for (const section of sections) {
    for (let i = 0; i < section.topics.length; i++) {
      const seed = section.topics[i]
      const nextInSection = section.topics[i + 1]
      topics.push({
        id: seed.id,
        track: section.track,
        sectionId: section.id,
        sectionTitle: section.title,
        title: seed.title,
        priority: seed.priority,
        executionPriority:
          seed.executionPriority ??
          defaultExecutionPriority(section.track, seed.priority),
        curriculumLevel: seed.curriculumLevel ?? 'classified-item',
        parentTopicId: seed.parentTopicId,
        targetMonths: seed.months,
        prerequisites: seed.prereqs ?? [],
        relatedTopics: seed.related ?? [],
        nextTopics: seed.next ?? (nextInSection ? [nextInSection.id] : []),
        usedInCapstone: seed.capstone,
        estimatedDepth: seed.depth ?? section.defaultDepth,
        kind: seed.kind ?? section.defaultKind,
        tags: seed.tags ?? [],
        contentReady: seed.contentReady ?? false,
      })
    }
  }
  return topics
}
