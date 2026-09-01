import type { CustomTopic, RevisionSlot, TopicOverlay, TopicProgress, UserState } from '@/domain/types'

export const EMPTY_USER_STATE: UserState = {
  version: 1,
  theme: 'system',
  topics: {},
  problems: {},
  notes: {},
  bookmarks: [],
  topicOverlays: {},
  customTopics: {},
  currentFocus: {},
}

export type ExportPayload = {
  app: 'se-prep'
  exportedAt: string
  state: UserState
}

export function exportUserState(state: UserState): string {
  const payload: ExportPayload = {
    app: 'se-prep',
    exportedAt: new Date().toISOString(),
    state,
  }
  return JSON.stringify(payload, null, 2)
}

function sanitizeOverlay(raw: unknown): TopicOverlay {
  if (!raw || typeof raw !== 'object') return {}
  const o = raw as Record<string, unknown>
  const out: TopicOverlay = {}
  for (const key of [
    'keyTakeaways',
    'quickRevision',
    'patternRecognition',
    'commonMistakes',
    'failureModes',
    'variations',
    'extraPoints',
  ] as const) {
    const val = o[key]
    if (Array.isArray(val)) {
      out[key] = val.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    }
  }
  return out
}

function sanitizeCustomTopic(raw: unknown): CustomTopic | null {
  if (!raw || typeof raw !== 'object') return null
  const t = raw as Record<string, unknown>
  if (typeof t.id !== 'string' || typeof t.title !== 'string') return null
  if (!['A', 'B', 'C', 'D', 'E'].includes(String(t.track))) return null
  const priority = t.priority === 'tier1' || t.priority === 'tier2' || t.priority === 'tier3'
    ? t.priority
    : 'tier2'
  const executionPriority =
    t.executionPriority === 'p0' ||
    t.executionPriority === 'p1' ||
    t.executionPriority === 'p2' ||
    t.executionPriority === 'later'
      ? t.executionPriority
      : 'p2'
  const months = Array.isArray(t.targetMonths)
    ? t.targetMonths.filter((n): n is number => typeof n === 'number')
    : [1]
  return {
    id: t.id,
    title: t.title,
    track: t.track as CustomTopic['track'],
    sectionTitle: typeof t.sectionTitle === 'string' ? t.sectionTitle : 'My Topics',
    priority,
    executionPriority,
    targetMonths: months.length ? months : [1],
    tags: Array.isArray(t.tags) ? t.tags.filter((x): x is string => typeof x === 'string') : [],
    whatIsIt: typeof t.whatIsIt === 'string' ? t.whatIsIt : undefined,
    whyExists: typeof t.whyExists === 'string' ? t.whyExists : undefined,
    mentalModel: typeof t.mentalModel === 'string' ? t.mentalModel : undefined,
    keyTakeaways: Array.isArray(t.keyTakeaways)
      ? t.keyTakeaways.filter((x): x is string => typeof x === 'string')
      : [],
    quickRevision: Array.isArray(t.quickRevision)
      ? t.quickRevision.filter((x): x is string => typeof x === 'string')
      : [],
    createdAt: typeof t.createdAt === 'string' ? t.createdAt : new Date().toISOString(),
    updatedAt: typeof t.updatedAt === 'string' ? t.updatedAt : new Date().toISOString(),
  }
}

function sanitizeRevisionSlot(raw: unknown): RevisionSlot | null {
  if (!raw || typeof raw !== 'object') return null
  const slot = raw as Record<string, unknown>
  if (typeof slot.id !== 'string' || typeof slot.date !== 'string') return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slot.date)) return null
  return {
    id: slot.id,
    name: typeof slot.name === 'string' ? slot.name : slot.id,
    task: typeof slot.task === 'string' ? slot.task : '',
    date: slot.date,
    completedAt: typeof slot.completedAt === 'string' ? slot.completedAt : undefined,
    clashBumped: slot.clashBumped === true ? true : undefined,
  }
}

function sanitizeTopicProgressMap(
  raw: UserState['topics'] | undefined,
): Record<string, TopicProgress> {
  const out: Record<string, TopicProgress> = {}
  for (const [id, progress] of Object.entries(raw ?? {})) {
    if (!progress || typeof progress !== 'object') continue
    const schedule = Array.isArray(progress.revisionSchedule)
      ? progress.revisionSchedule
          .map(sanitizeRevisionSlot)
          .filter((slot): slot is RevisionSlot => Boolean(slot))
      : []
    out[id] = {
      ...progress,
      revisionSchedule: schedule,
    }
  }
  return out
}

export function importUserState(json: string): UserState {
  const parsed = JSON.parse(json) as ExportPayload | UserState
  const state = 'state' in parsed && parsed.app === 'se-prep' ? parsed.state : (parsed as UserState)

  if (!state || state.version !== 1) {
    throw new Error('Unsupported or invalid export format')
  }

  const topicOverlays: Record<string, TopicOverlay> = {}
  const rawOverlays = state.topicOverlays ?? {}
  for (const [id, overlay] of Object.entries(rawOverlays)) {
    topicOverlays[id] = sanitizeOverlay(overlay)
  }

  const customTopics: Record<string, CustomTopic> = {}
  const rawCustom = state.customTopics ?? {}
  for (const [id, topic] of Object.entries(rawCustom)) {
    const cleaned = sanitizeCustomTopic(topic)
    if (cleaned) customTopics[id] = cleaned
  }

  return {
    version: 1,
    theme: state.theme ?? 'system',
    topics: sanitizeTopicProgressMap(state.topics),
    problems: state.problems ?? {},
    notes: state.notes ?? {},
    bookmarks: state.bookmarks ?? [],
    topicOverlays,
    customTopics,
    currentFocus: state.currentFocus ?? {},
  }
}
