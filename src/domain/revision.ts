import type { Confidence, StudyStatus, TopicProgress } from '@/domain/types'

const DAY_MS = 24 * 60 * 60 * 1000

export function defaultTopicProgress(): TopicProgress {
  return {
    status: 'not_started',
    confidence: 1,
    revisionCount: 0,
    revisionSchedule: [],
  }
}

export function computeNextRevision(
  status: StudyStatus,
  confidence: Confidence,
  from: Date = new Date(),
): string | undefined {
  if (status === 'not_started') return undefined
  if (status === 'needs_revision') {
    return new Date(from.getTime() - DAY_MS).toISOString()
  }
  if (status === 'learning') {
    return new Date(from.getTime() + 1 * DAY_MS).toISOString()
  }
  if (status === 'first_pass') {
    const days = confidence <= 2 ? 2 : 3
    return new Date(from.getTime() + days * DAY_MS).toISOString()
  }
  // interview_ready
  const days = confidence >= 5 ? 21 : confidence >= 4 ? 14 : 7
  return new Date(from.getTime() + days * DAY_MS).toISOString()
}

export type RevisionBucket = 'overdue' | 'due_today' | 'this_week' | 'later' | 'none'

export function getRevisionBucket(
  nextRevision: string | undefined,
  now: Date = new Date(),
): RevisionBucket {
  if (!nextRevision) return 'none'
  const due = new Date(nextRevision)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfToday = new Date(startOfToday.getTime() + DAY_MS)
  const endOfWeek = new Date(startOfToday.getTime() + 7 * DAY_MS)

  if (due < startOfToday) return 'overdue'
  if (due < endOfToday) return 'due_today'
  if (due < endOfWeek) return 'this_week'
  return 'later'
}

export function isDueForRevision(
  progress: TopicProgress,
  now: Date = new Date(),
): boolean {
  const bucket = getRevisionBucket(progress.nextRevision, now)
  return bucket === 'overdue' || bucket === 'due_today'
}
