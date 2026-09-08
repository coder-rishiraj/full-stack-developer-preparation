import type { RevisionSlot, StudyStatus, TopicProgress } from '@/domain/types'

export type StrategyKind =
  | 'offset'
  | 'weekly'
  | 'month_end'
  | 'quarter_sunday'
  | 'before_interview'

export type StrategyRule = {
  id: string
  name: string
  task: string
  kind: StrategyKind
  enabled: boolean
  offsetDays?: number
  weekday?: number
  weeksAfterStudy?: number
  months?: number[]
  windowDays?: number
}

/** Memora default revision pattern (rev1–rev8). */
export const DEFAULT_REVISION_RULES: StrategyRule[] = [
  {
    id: 'rev1',
    name: 'Same day',
    task: 'Active recall only — no reading before recall',
    kind: 'offset',
    enabled: true,
    offsetDays: 0,
  },
  {
    id: 'rev2',
    name: 'Next day',
    task: "Recall yesterday's topic, then patch weak points",
    kind: 'offset',
    enabled: true,
    offsetDays: 1,
  },
  {
    id: 'rev3',
    name: 'Day 3',
    task: 'Third-day active recall before the weekly pass',
    kind: 'offset',
    enabled: true,
    offsetDays: 2,
  },
  {
    id: 'rev4',
    name: 'Next Sunday',
    task: 'Weekly consolidation: recall first, then review notes',
    kind: 'weekly',
    enabled: true,
    weekday: 0,
    weeksAfterStudy: 0,
  },
  {
    id: 'rev5',
    name: 'Second Sunday',
    task: 'Next available Sunday after rev 4',
    kind: 'weekly',
    enabled: true,
    weekday: 0,
    weeksAfterStudy: 1,
  },
  {
    id: 'rev6',
    name: 'Month-end Sunday',
    task: 'Month-end sweep: connect topics and fix gaps',
    kind: 'month_end',
    enabled: true,
    weekday: 0,
  },
  {
    id: 'rev7',
    name: 'Quarter Sunday',
    task: 'Last Sunday of the quarter month (Mar / Jun / Sep / Dec)',
    kind: 'quarter_sunday',
    enabled: true,
    weekday: 0,
    months: [3, 6, 9, 12],
  },
  {
    id: 'rev8',
    name: 'Before interview',
    task: 'Final pass on the Sunday before your interview',
    kind: 'before_interview',
    enabled: true,
    weekday: 0,
  },
]

const STUDIED: StudyStatus[] = ['learning', 'first_pass', 'interview_ready']

export function isStudiedStatus(status: StudyStatus): boolean {
  return STUDIED.includes(status)
}

export function toDateOnly(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function dateOnlyToIso(value: string): string {
  return new Date(`${value}T12:00:00`).toISOString()
}

function addDays(value: string, days: number): string {
  const date = parseDateOnly(value)
  date.setDate(date.getDate() + days)
  return toDateOnly(date)
}

function compareDateOnly(a: string, b: string): number {
  return a.localeCompare(b)
}

function nextWeekdayOnOrAfter(value: string, weekday: number): string {
  const date = parseDateOnly(value)
  const delta = (weekday - date.getDay() + 7) % 7
  date.setDate(date.getDate() + delta)
  return toDateOnly(date)
}

function nextWeekdayAfter(value: string, weekday: number): string {
  const date = parseDateOnly(value)
  if (date.getDay() === weekday) {
    date.setDate(date.getDate() + 7)
    return toDateOnly(date)
  }
  return nextWeekdayOnOrAfter(value, weekday)
}

function lastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 0)
}

function lastWeekdayOfMonth(year: number, month: number, weekday: number): string {
  const last = lastDayOfMonth(year, month)
  const delta = (last.getDay() - weekday + 7) % 7
  last.setDate(last.getDate() - delta)
  return toDateOnly(last)
}

function nextWeekdayOnOrBefore(value: string, weekday: number): string {
  const date = parseDateOnly(value)
  const delta = (date.getDay() - weekday + 7) % 7
  date.setDate(date.getDate() - delta)
  return toDateOnly(date)
}

function weekAnchorDate(studied: string, rule: StrategyRule): string {
  const weekday = rule.weekday ?? 0
  const weeks = Math.min(Math.max(rule.weeksAfterStudy ?? 0, 0), 520)
  if (weeks === 0) return nextWeekdayOnOrAfter(studied, weekday)
  if (weeks === 1) return nextWeekdayOnOrAfter(addDays(studied, 7), weekday)
  let date = studied
  for (let i = 0; i < weeks; i++) {
    date = nextWeekdayOnOrAfter(addDays(date, 1), weekday)
  }
  return date
}

function monthEndDate(studied: string, rule: StrategyRule): string | undefined {
  const date = parseDateOnly(studied)
  const candidate = lastWeekdayOfMonth(
    date.getFullYear(),
    date.getMonth() + 1,
    rule.weekday ?? 0,
  )
  return compareDateOnly(candidate, studied) < 0 ? undefined : candidate
}

function nextMonthEndAfter(current: string, rule: StrategyRule): string {
  const date = parseDateOnly(current)
  date.setMonth(date.getMonth() + 1)
  return lastWeekdayOfMonth(date.getFullYear(), date.getMonth() + 1, rule.weekday ?? 0)
}

function quarterSundayDate(studied: string, rule: StrategyRule): string | undefined {
  const months = (rule.months ?? [3, 6, 9, 12]).filter((m) => m >= 1 && m <= 12)
  const weekday = rule.weekday ?? 0
  const start = parseDateOnly(studied)
  for (let year = start.getFullYear(); year <= start.getFullYear() + 3; year++) {
    for (const month of months) {
      const candidate = lastWeekdayOfMonth(year, month, weekday)
      if (compareDateOnly(candidate, studied) >= 0) return candidate
    }
  }
  return undefined
}

function nextQuarterSundayAfter(after: string, rule: StrategyRule): string | undefined {
  const months = (rule.months ?? [3, 6, 9, 12]).filter((m) => m >= 1 && m <= 12)
  const weekday = rule.weekday ?? 0
  const afterDate = parseDateOnly(after)
  for (let year = afterDate.getFullYear(); year <= afterDate.getFullYear() + 4; year++) {
    for (const month of months) {
      const candidate = lastWeekdayOfMonth(year, month, weekday)
      if (compareDateOnly(candidate, after) > 0) return candidate
    }
  }
  return undefined
}

function beforeInterviewDate(
  studied: string,
  interviewDate: string | undefined,
  rule: StrategyRule,
): string | undefined {
  if (!interviewDate) return undefined
  if (compareDateOnly(interviewDate, studied) <= 0) return undefined
  const dayBefore = addDays(interviewDate, -1)
  const candidate = nextWeekdayOnOrBefore(dayBefore, rule.weekday ?? 0)
  return compareDateOnly(candidate, studied) >= 0 ? candidate : undefined
}

function naturalDateForRule(
  studied: string,
  rule: StrategyRule,
  interviewDate?: string,
): string | undefined {
  switch (rule.kind) {
    case 'offset':
      return addDays(studied, Math.min(Math.max(rule.offsetDays ?? 0, 0), 365))
    case 'weekly':
      return weekAnchorDate(studied, rule)
    case 'month_end':
      return monthEndDate(studied, rule)
    case 'quarter_sunday':
      return quarterSundayDate(studied, rule)
    case 'before_interview':
      return beforeInterviewDate(studied, interviewDate, rule)
  }
}

function bumpDateForRule(current: string, rule: StrategyRule): string | undefined {
  switch (rule.kind) {
    case 'offset':
      return addDays(current, 1)
    case 'weekly':
      return nextWeekdayAfter(current, rule.weekday ?? 0)
    case 'month_end':
      return nextMonthEndAfter(current, rule)
    case 'quarter_sunday':
      return nextQuarterSundayAfter(current, rule)
    case 'before_interview':
      // Cannot bump past interview — skip if clash cannot resolve before interview.
      return undefined
  }
}

export type BuildScheduleOptions = {
  interviewDate?: string
}

export function buildRevisionSchedule(
  studiedOn: Date,
  rules: StrategyRule[] = DEFAULT_REVISION_RULES,
  options: BuildScheduleOptions = {},
): RevisionSlot[] {
  const studied = toDateOnly(studiedOn)
  const occupied = new Set<string>()
  const slots: RevisionSlot[] = []
  let earliestAllowed = studied

  for (const rule of rules) {
    if (!rule.enabled) continue
    const natural = naturalDateForRule(studied, rule, options.interviewDate)
    if (!natural) continue

    const relaxOrder = rule.kind === 'before_interview'
    let date = natural
    let bumped = false
    for (let guard = 0; guard < 4096; guard++) {
      const orderOk = relaxOrder || compareDateOnly(date, earliestAllowed) >= 0
      if (!occupied.has(date) && orderOk) break
      const next = bumpDateForRule(date, rule)
      if (!next) {
        date = ''
        break
      }
      if (
        rule.kind === 'before_interview' &&
        options.interviewDate &&
        compareDateOnly(next, options.interviewDate) >= 0
      ) {
        date = ''
        break
      }
      date = next
      bumped = true
    }
    if (!date || occupied.has(date)) continue
    if (!relaxOrder && compareDateOnly(date, earliestAllowed) < 0) continue

    occupied.add(date)
    if (!relaxOrder) earliestAllowed = addDays(date, 1)
    slots.push({
      id: rule.id,
      name: rule.name,
      task: rule.task,
      date,
      clashBumped: bumped || undefined,
    })
  }

  return slots.sort((a, b) => compareDateOnly(a.date, b.date) || a.id.localeCompare(b.id))
}

export function nextPendingSlot(
  schedule: RevisionSlot[] | undefined,
): RevisionSlot | undefined {
  return (schedule ?? []).find((slot) => !slot.completedAt)
}

export function nextRevisionFromSchedule(
  schedule: RevisionSlot[] | undefined,
): string | undefined {
  const pending = nextPendingSlot(schedule)
  return pending ? dateOnlyToIso(pending.date) : undefined
}

export function completeNextRevisionSlot(
  schedule: RevisionSlot[],
  at: Date = new Date(),
): RevisionSlot[] {
  const today = toDateOnly(at)
  const dueIndex = schedule.findIndex(
    (slot) => !slot.completedAt && compareDateOnly(slot.date, today) <= 0,
  )
  const index =
    dueIndex >= 0 ? dueIndex : schedule.findIndex((slot) => !slot.completedAt)
  if (index < 0) return schedule
  return schedule.map((slot, i) =>
    i === index ? { ...slot, completedAt: at.toISOString() } : slot,
  )
}

export function mergeSchedulePreservingCompletion(
  previous: RevisionSlot[] | undefined,
  next: RevisionSlot[],
): RevisionSlot[] {
  const done = new Map(
    (previous ?? [])
      .filter((slot) => slot.completedAt)
      .map((slot) => [slot.id, slot.completedAt!]),
  )
  return next.map((slot) =>
    done.has(slot.id) ? { ...slot, completedAt: done.get(slot.id) } : slot,
  )
}

export function applyStudyRevisionSchedule(
  existing: TopicProgress,
  status: StudyStatus,
  at: Date = new Date(),
  options: BuildScheduleOptions = {},
): Pick<TopicProgress, 'revisionSchedule' | 'nextRevision'> {
  if (status === 'not_started') {
    return { revisionSchedule: [], nextRevision: undefined }
  }
  if (isStudiedStatus(status)) {
    const shouldBuild =
      !existing.revisionSchedule?.length || existing.status === 'not_started'
    const revisionSchedule = shouldBuild
      ? buildRevisionSchedule(at, DEFAULT_REVISION_RULES, options)
      : existing.revisionSchedule
    return {
      revisionSchedule,
      nextRevision: nextRevisionFromSchedule(revisionSchedule),
    }
  }
  return {
    revisionSchedule: existing.revisionSchedule ?? [],
    nextRevision:
      nextRevisionFromSchedule(existing.revisionSchedule) ??
      dateOnlyToIso(addDays(toDateOnly(at), -1)),
  }
}
