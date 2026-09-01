import type { ReactNode } from 'react'
import type {
  DsaStatus,
  ExecutionPriority,
  Priority,
  StudyStatus,
  TrackId,
} from '@/domain/types'

const priorityLabel: Record<Priority, string> = {
  tier1: '🔴 Tier 1',
  tier2: '🟠 Tier 2',
  tier3: '🟡 Tier 3',
}

const executionLabel: Record<ExecutionPriority, string> = {
  p0: 'P0 · Now',
  p1: 'P1 · Next',
  p2: 'P2 · Later',
  later: 'Later',
}

const statusLabel: Record<StudyStatus, string> = {
  not_started: 'Not Started',
  learning: 'Learning',
  first_pass: 'First Pass',
  interview_ready: 'Interview Ready',
  needs_revision: 'Needs Revision',
}

const dsaLabel: Record<DsaStatus, string> = {
  not_attempted: 'Not Attempted',
  attempted: 'Attempted',
  could_not_solve: 'Could Not Solve',
  solved_with_hint: 'Solved With Hint',
  solved_independently: 'Solved Independently',
  revision_due: 'Revision Due',
  mastered: 'Mastered',
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'tier1' | 'tier2' | 'tier3' | 'track' | 'success' | 'warning' | 'danger' | 'info'
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border)]',
    tier1: 'bg-red-50 text-[var(--tier1)] border-red-200 dark:bg-red-950/40 dark:border-red-900',
    tier2: 'bg-amber-50 text-[var(--tier2)] border-amber-200 dark:bg-amber-950/40',
    tier3: 'bg-yellow-50 text-[var(--tier3)] border-yellow-200 dark:bg-yellow-950/40',
    track: 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--border)]',
    success: 'bg-green-50 text-[var(--success)] border-green-200 dark:bg-green-950/40',
    warning: 'bg-amber-50 text-[var(--warning)] border-amber-200',
    danger: 'bg-red-50 text-[var(--danger)] border-red-200',
    info: 'bg-sky-50 text-[var(--info)] border-sky-200 dark:bg-sky-950/40',
  }
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge tone={priority}>{priorityLabel[priority]}</Badge>
}

export function ExecutionPriorityBadge({
  priority,
}: {
  priority: ExecutionPriority
}) {
  const tone =
    priority === 'p0'
      ? 'danger'
      : priority === 'p1'
        ? 'warning'
        : priority === 'p2'
          ? 'info'
          : 'neutral'
  return <Badge tone={tone}>{executionLabel[priority] ?? 'Later'}</Badge>
}

export function StatusBadge({ status }: { status: StudyStatus }) {
  const tone =
    status === 'interview_ready'
      ? 'success'
      : status === 'needs_revision'
        ? 'warning'
        : status === 'learning'
          ? 'info'
          : status === 'first_pass'
            ? 'track'
            : 'neutral'
  return <Badge tone={tone}>{statusLabel[status]}</Badge>
}

export function DsaStatusBadge({ status }: { status: DsaStatus }) {
  return <Badge tone="neutral">{dsaLabel[status]}</Badge>
}

export function TrackBadge({ track }: { track: TrackId }) {
  return <Badge tone="track">Track {track}</Badge>
}
