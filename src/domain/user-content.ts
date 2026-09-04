import { TOPICS, getTopicMeta } from '@/content/taxonomy'
import type {
  CustomTopic,
  ExecutionPriority,
  OverlayListField,
  Priority,
  TopicContent,
  TopicMeta,
  TopicOverlay,
  TrackId,
  UserState,
} from '@/domain/types'

export const OVERLAY_FIELDS: {
  field: OverlayListField
  label: string
}[] = [
  { field: 'keyTakeaways', label: 'Key Takeaways' },
  { field: 'quickRevision', label: 'Quick Revision' },
  { field: 'patternRecognition', label: 'Pattern Recognition' },
  { field: 'commonMistakes', label: 'Common Mistakes' },
  { field: 'failureModes', label: 'Failure Modes' },
  { field: 'variations', label: 'Variations' },
  { field: 'extraPoints', label: 'Your additions' },
]

export function emptyOverlay(): TopicOverlay {
  return {}
}

export function getOverlay(state: UserState, topicId: string): TopicOverlay {
  return state.topicOverlays[topicId] ?? emptyOverlay()
}

export function overlayList(overlay: TopicOverlay, field: OverlayListField): string[] {
  return overlay[field] ?? []
}

export function isCustomTopicId(id: string): boolean {
  return id.startsWith('custom-')
}

export function listCustomTopicsFromMap(
  customTopics: Record<string, CustomTopic> | undefined,
): CustomTopic[] {
  return Object.values(customTopics ?? {}).sort((a, b) =>
    (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''),
  )
}

export function listCustomTopics(state: UserState): CustomTopic[] {
  return listCustomTopicsFromMap(state.customTopics)
}

export function getCustomTopic(state: UserState, id: string): CustomTopic | undefined {
  return state.customTopics[id]
}

export function defaultCustomSectionId(track: TrackId): string {
  return `CUSTOM-${track}`
}

export function createCustomSectionId(track: TrackId, title: string): string {
  const slug = slugifyTopicTitle(title)
  return `CUSTOM-${track}-${slug}`
}

export function isCustomSectionId(sectionId: string): boolean {
  return sectionId.startsWith('CUSTOM-')
}

export function customTopicToMeta(topic: CustomTopic): TopicMeta {
  return {
    id: topic.id,
    track: topic.track,
    sectionId: topic.sectionId || defaultCustomSectionId(topic.track),
    sectionTitle: topic.sectionTitle || 'My Topics',
    title: topic.title,
    priority: topic.priority,
    executionPriority: topic.executionPriority,
    curriculumLevel: 'classified-item',
    targetMonths: topic.targetMonths.length ? topic.targetMonths : [1],
    prerequisites: [],
    relatedTopics: [],
    nextTopics: [],
    estimatedDepth: 'medium',
    kind: 'theory',
    tags: [...topic.tags, 'custom'],
    contentReady: true,
  }
}

export function customTopicToContent(topic: CustomTopic, overlay?: TopicOverlay): TopicContent {
  const takeaways = [
    ...topic.keyTakeaways,
    ...(overlay?.keyTakeaways ?? []),
  ]
  const revision = [
    ...topic.quickRevision,
    ...(overlay?.quickRevision ?? []),
  ]
  return {
    whatIsIt: topic.whatIsIt,
    whyExists: topic.whyExists,
    mentalModel: topic.mentalModel,
    keyTakeaways: takeaways.length
      ? takeaways
      : ['Add key takeaways for this custom topic.'],
    quickRevision: revision.length ? revision : ['Add a quick revision point.'],
    flashcards: topic.keyTakeaways.slice(0, 3).map((k) => ({
      front: topic.title,
      back: k,
    })),
    interviewQuestions: [
      {
        level: 'basic',
        question: `Explain ${topic.title} in your own words.`,
        answerHint: topic.whatIsIt || 'Summarize definition and why it matters.',
      },
    ],
    patternRecognition: overlay?.patternRecognition,
    commonMistakes: overlay?.commonMistakes,
    failureModes: overlay?.failureModes,
    variations: overlay?.variations,
  }
}

/** Curriculum meta or custom-topic meta. */
export function resolveTopicMeta(
  state: UserState,
  topicId: string,
): TopicMeta | undefined {
  const custom = state.customTopics[topicId]
  if (custom) return customTopicToMeta(custom)
  return getTopicMeta(topicId)
}

/** All topics visible in roadmap/search: curriculum + custom. */
export function allVisibleTopics(state: UserState): TopicMeta[] {
  return [...TOPICS, ...listCustomTopics(state).map(customTopicToMeta)]
}

export function slugifyTopicTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'topic'
}

export function createCustomTopicId(title: string): string {
  const slug = slugifyTopicTitle(title)
  const suffix = Math.random().toString(36).slice(2, 8)
  return `custom-${slug}-${suffix}`
}

export function buildCustomTopicInput(input: {
  title: string
  track: TrackId
  sectionId?: string
  sectionTitle?: string
  priority?: Priority
  executionPriority?: ExecutionPriority
  targetMonths?: number[]
  tags?: string[]
  whatIsIt?: string
  whyExists?: string
  mentalModel?: string
  keyTakeaways?: string[]
  quickRevision?: string[]
}): CustomTopic {
  const now = new Date().toISOString()
  const sectionTitle = input.sectionTitle?.trim() || 'My Topics'
  return {
    id: createCustomTopicId(input.title),
    title: input.title.trim(),
    track: input.track,
    sectionId:
      input.sectionId?.trim() ||
      defaultCustomSectionId(input.track),
    sectionTitle,
    priority: input.priority ?? 'tier2',
    executionPriority: input.executionPriority ?? 'p2',
    targetMonths: input.targetMonths?.length ? input.targetMonths : [1],
    tags: input.tags ?? [],
    whatIsIt: input.whatIsIt?.trim() || undefined,
    whyExists: input.whyExists?.trim() || undefined,
    mentalModel: input.mentalModel?.trim() || undefined,
    keyTakeaways: (input.keyTakeaways ?? []).map((s) => s.trim()).filter(Boolean),
    quickRevision: (input.quickRevision ?? []).map((s) => s.trim()).filter(Boolean),
    createdAt: now,
    updatedAt: now,
  }
}

export function mergeOverlayIntoContent(
  content: TopicContent,
  overlay: TopicOverlay | undefined,
): TopicContent {
  if (!overlay) return content
  return {
    ...content,
    keyTakeaways: [
      ...content.keyTakeaways,
      ...(overlay.keyTakeaways ?? []),
    ],
    quickRevision: [
      ...content.quickRevision,
      ...(overlay.quickRevision ?? []),
    ],
    patternRecognition: mergeOptionalLists(
      content.patternRecognition,
      overlay.patternRecognition,
    ),
    commonMistakes: mergeOptionalLists(content.commonMistakes, overlay.commonMistakes),
    failureModes: mergeOptionalLists(content.failureModes, overlay.failureModes),
    variations: mergeOptionalLists(content.variations, overlay.variations),
  }
}

function mergeOptionalLists(
  base: string[] | undefined,
  extra: string[] | undefined,
): string[] | undefined {
  if (!base?.length && !extra?.length) return undefined
  return [...(base ?? []), ...(extra ?? [])]
}

/** Points that are user-authored for a field (for UI badges). */
export function userPointsForField(
  overlay: TopicOverlay | undefined,
  field: OverlayListField,
): string[] {
  return overlay?.[field] ?? []
}
