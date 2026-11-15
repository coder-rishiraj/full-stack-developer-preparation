import type {
  CustomTopic,
  ProblemProgress,
  TopicOverlay,
  TopicProgress,
  UserState,
} from '@/domain/types'

/** True when a state holds anything worth carrying into an account. */
export function hasMeaningfulProgress(state: UserState): boolean {
  return (
    Object.values(state.topics).some((t) => t.status !== 'not_started') ||
    Object.values(state.problems).some((p) => p.status !== 'not_attempted') ||
    Object.values(state.notes).some((n) => n.trim().length > 0) ||
    state.bookmarks.length > 0 ||
    Object.keys(state.topicOverlays).length > 0 ||
    Object.keys(state.customTopics).length > 0 ||
    Object.keys(state.capstoneTasks).length > 0 ||
    Boolean(state.interviewDate)
  )
}

function ts(...values: (string | undefined)[]): number {
  let best = 0
  for (const v of values) {
    const n = v ? Date.parse(v) : NaN
    if (!Number.isNaN(n) && n > best) best = n
  }
  return best
}

function pickTopic(a: TopicProgress | undefined, b: TopicProgress | undefined): TopicProgress {
  if (!a) return b!
  if (!b) return a
  if (a.status === 'not_started' && b.status !== 'not_started') return b
  if (b.status === 'not_started' && a.status !== 'not_started') return a
  return ts(b.lastStudied, b.lastRevised) > ts(a.lastStudied, a.lastRevised) ? b : a
}

function pickProblem(
  a: ProblemProgress | undefined,
  b: ProblemProgress | undefined,
): ProblemProgress {
  if (!a) return b!
  if (!b) return a
  const newer = ts(b.lastAttempted, b.lastSolved) > ts(a.lastAttempted, a.lastSolved) ? b : a
  const older = newer === a ? b : a
  const seen = new Set<string>()
  const attemptHistory = [...older.attemptHistory, ...newer.attemptHistory]
    .filter((h) => {
      const key = `${h.at}|${h.outcome}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((x, y) => Date.parse(x.at) - Date.parse(y.at))
  return {
    ...newer,
    solvedIndependently: a.solvedIndependently || b.solvedIndependently,
    solvedWithHints: a.solvedWithHints || b.solvedWithHints,
    solutionViewed: a.solutionViewed || b.solutionViewed,
    attempts: Math.max(a.attempts, b.attempts, attemptHistory.length),
    attemptHistory,
  }
}

function mergeRecords<T>(
  a: Record<string, T>,
  b: Record<string, T>,
  pick: (x: T | undefined, y: T | undefined) => T,
): Record<string, T> {
  const out: Record<string, T> = {}
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) {
    out[id] = pick(a[id], b[id])
  }
  return out
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)]
}

function mergeOverlay(a: TopicOverlay | undefined, b: TopicOverlay | undefined): TopicOverlay {
  const out: TopicOverlay = { ...a }
  for (const [key, list] of Object.entries(b ?? {}) as [keyof TopicOverlay, string[] | undefined][]) {
    if (list?.length) out[key] = unique([...(out[key] ?? []), ...list])
  }
  return out
}

function pickCustomTopic(a: CustomTopic | undefined, b: CustomTopic | undefined): CustomTopic {
  if (!a) return b!
  if (!b) return a
  return ts(b.updatedAt) > ts(a.updatedAt) ? b : a
}

function mergeNote(a: string | undefined, b: string | undefined): string {
  const x = a?.trim() ?? ''
  const y = b?.trim() ?? ''
  if (!x) return b ?? ''
  if (!y || x === y || x.includes(y)) return a ?? ''
  return `${a}\n\n${b}`
}

/**
 * Combines progress made as a guest on this device (`guest`) into the
 * signed-in account's saved progress (`account`), so nothing is lost the
 * first time someone signs in. The account's preferences win; for progress
 * the more recent / more advanced record wins and lists are unioned.
 */
export function mergeUserStates(account: UserState, guest: UserState): UserState {
  return {
    ...account,
    recentTopics: unique([...account.recentTopics, ...guest.recentTopics]).slice(0, 20),
    capstoneTasks: { ...guest.capstoneTasks, ...account.capstoneTasks },
    interviewDate: account.interviewDate ?? guest.interviewDate,
    topics: mergeRecords(account.topics, guest.topics, pickTopic),
    problems: mergeRecords(account.problems, guest.problems, pickProblem),
    notes: mergeRecords(account.notes, guest.notes, mergeNote),
    bookmarks: unique([...account.bookmarks, ...guest.bookmarks]),
    topicOverlays: mergeRecords(account.topicOverlays, guest.topicOverlays, mergeOverlay),
    customTopics: mergeRecords(account.customTopics, guest.customTopics, pickCustomTopic),
    currentFocus: {
      learning: account.currentFocus.learning ?? guest.currentFocus.learning,
      upNext: account.currentFocus.upNext ?? guest.currentFocus.upNext,
    },
  }
}
