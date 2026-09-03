import { TOPICS } from '@/content/taxonomy'
import { PROBLEMS } from '@/content/problems'
import { getRevisionBucket } from '@/domain/revision'
import { allVisibleTopics } from '@/domain/user-content'
import type {
  ExecutionPriority,
  Priority,
  StudyStatus,
  TopicMeta,
  TopicProgress,
  UserState,
  TrackId,
  DsaStatus,
} from '@/domain/types'

const COMPLETED: StudyStatus[] = ['first_pass', 'interview_ready']

/** Core Java language round: C1.* plus JVM and concurrency — not C10 Redis. */
export function isJavaLanguageRound(t: { track: string; sectionId: string }) {
  return (
    t.track === 'C' &&
    (t.sectionId.startsWith('C1.') ||
      t.sectionId.startsWith('C2.') ||
      t.sectionId.startsWith('C3.'))
  )
}

export function getTopicProgress(
  state: UserState,
  topicId: string,
): TopicProgress {
  return (
    state.topics[topicId] ?? {
      status: 'not_started',
      confidence: 1,
      revisionCount: 0,
    }
  )
}

export function completionPercent(
  topics: TopicMeta[],
  state: UserState,
  predicate?: (t: TopicMeta) => boolean,
): number {
  const filtered = predicate ? topics.filter(predicate) : topics
  if (filtered.length === 0) return 0
  const done = filtered.filter((t) =>
    COMPLETED.includes(getTopicProgress(state, t.id).status),
  ).length
  return Math.round((done / filtered.length) * 100)
}

export function overallPrep(state: UserState) {
  return {
    overall: completionPercent(TOPICS, state),
    tier1: completionPercent(TOPICS, state, (t) => t.priority === 'tier1'),
    tier2: completionPercent(TOPICS, state, (t) => t.priority === 'tier2'),
    tier3: completionPercent(TOPICS, state, (t) => t.priority === 'tier3'),
  }
}

export function trackProgress(state: UserState) {
  const tracks: TrackId[] = ['A', 'B', 'C', 'D', 'E']
  return Object.fromEntries(
    tracks.map((id) => [
      id,
      completionPercent(TOPICS, state, (t) => t.track === id),
    ]),
  ) as Record<TrackId, number>
}

export function revisionSummary(state: UserState, now = new Date()) {
  let dueToday = 0
  let overdue = 0
  let thisWeek = 0

  for (const topic of TOPICS) {
    const p = getTopicProgress(state, topic.id)
    const bucket = getRevisionBucket(p.nextRevision, now)
    if (bucket === 'due_today') dueToday++
    if (bucket === 'overdue') overdue++
    if (bucket === 'this_week') thisWeek++
  }

  return { dueToday, overdue, thisWeek }
}

export function dsaSummary(state: UserState) {
  const total = PROBLEMS.length
  let attempted = 0
  let solvedIndependently = 0
  let solvedWithHints = 0
  let couldNotSolve = 0
  let needsRevision = 0
  let csesDone = 0
  let neetcodeDone = 0
  let csesTotal = 0
  let neetcodeTotal = 0

  const solvedLike: DsaStatus[] = [
    'solved_independently',
    'solved_with_hint',
    'mastered',
  ]

  for (const p of PROBLEMS) {
    if (p.source === 'cses') csesTotal++
    if (p.source === 'neetcode250') neetcodeTotal++
    const prog = state.problems[p.id]
    if (!prog || prog.status === 'not_attempted') continue
    attempted++
    if (prog.solvedIndependently || prog.status === 'solved_independently' || prog.status === 'mastered') {
      solvedIndependently++
    }
    if (prog.solvedWithHints || prog.status === 'solved_with_hint') {
      solvedWithHints++
    }
    if (prog.status === 'could_not_solve') couldNotSolve++
    if (prog.status === 'revision_due') needsRevision++
    if (solvedLike.includes(prog.status)) {
      if (p.source === 'cses') csesDone++
      if (p.source === 'neetcode250') neetcodeDone++
    }
  }

  return {
    total,
    attempted,
    solvedIndependently,
    solvedWithHints,
    couldNotSolve,
    needsRevision,
    csesProgress: csesTotal === 0 ? 0 : Math.round((csesDone / csesTotal) * 100),
    neetcodeProgress:
      neetcodeTotal === 0 ? 0 : Math.round((neetcodeDone / neetcodeTotal) * 100),
  }
}

/** Interview readiness from explicit progress — never fabricated scores. */
export function interviewReadiness(state: UserState) {
  const areaTopics: Record<string, (t: TopicMeta) => boolean> = {
    DSA: (t) => t.track === 'A',
    Java: (t) => isJavaLanguageRound(t),
    Backend: (t) => t.track === 'C',
    Frontend: (t) => t.track === 'B',
    LLD: (t) => t.track === 'D' && ['D1', 'D2', 'D3'].includes(t.sectionId),
    HLD: (t) =>
      t.track === 'D' &&
      (t.kind === 'system-design' ||
        ['D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'].some(
          (prefix) => t.sectionId === prefix || t.sectionId.startsWith(`${prefix}.`),
        )),
    Databases: (t) => t.sectionId.startsWith('C7') || t.tags.includes('postgresql'),
    'Distributed Systems': (t) => t.track === 'D',
    'Applied AI': (t) => t.track === 'E',
  }

  const result: Record<string, { ready: number; total: number; percent: number }> = {}

  for (const [name, pred] of Object.entries(areaTopics)) {
    const topics = TOPICS.filter(pred)
    const total = topics.length
    const ready = topics.filter(
      (t) => getTopicProgress(state, t.id).status === 'interview_ready',
    ).length
    result[name] = {
      ready,
      total,
      percent: total === 0 ? 0 : Math.round((ready / total) * 100),
    }
  }

  return result
}

export function currentFocusItems(state: UserState) {
  const learning = TOPICS.filter(
    (t) => getTopicProgress(state, t.id).status === 'learning',
  )
  const needsRevision = TOPICS.filter(
    (t) => getTopicProgress(state, t.id).status === 'needs_revision',
  )
  const recentlyCompleted = TOPICS.filter((t) => {
    const p = getTopicProgress(state, t.id)
    return COMPLETED.includes(p.status) && !!p.lastStudied
  }).sort((a, b) => {
    const da = getTopicProgress(state, a.id).lastStudied ?? ''
    const db = getTopicProgress(state, b.id).lastStudied ?? ''
    return db.localeCompare(da)
  })

  const upNext = TOPICS.filter(
    (t) => getTopicProgress(state, t.id).status === 'not_started',
  )

  return {
    learning,
    upNext: upNext.slice(0, 5),
    needsRevision,
    recentlyCompleted: recentlyCompleted.slice(0, 5),
    focusLearningId: state.currentFocus.learning,
    focusUpNextId: state.currentFocus.upNext,
  }
}

export function filterTopics(opts: {
  month?: number
  track?: TrackId
  priority?: Priority
  executionPriority?: ExecutionPriority
  status?: StudyStatus
  state: UserState
}) {
  return allVisibleTopics(opts.state).filter((t) => {
    if (opts.month && !t.targetMonths.includes(opts.month)) return false
    if (opts.track && t.track !== opts.track) return false
    if (opts.priority && t.priority !== opts.priority) return false
    if (
      opts.executionPriority &&
      t.executionPriority !== opts.executionPriority
    )
      return false
    if (opts.status && getTopicProgress(opts.state, t.id).status !== opts.status)
      return false
    return true
  })
}
