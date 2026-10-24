import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { ExecutionPriority, Priority, StudyStatus } from '@/domain/types'
import { StatusBadge } from '@/components/ui/Badge'

const PRIORITY_LABEL: Record<Priority, string> = { tier1: 'Core', tier2: 'Important', tier3: 'Extended' }
const DIFFICULTY_LABEL = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' } as const

export function TopicListRow({
  to,
  title,
  priority,
  executionPriority,
  status,
  notesReady,
  nested,
  extra,
  lessonReady,
  summary,
  difficulty,
  minutes,
}: {
  to: string
  title: string
  priority: Priority
  executionPriority: ExecutionPriority
  status: StudyStatus
  notesReady?: boolean
  nested?: boolean
  extra?: ReactNode
  lessonReady?: boolean
  summary?: string
  difficulty?: keyof typeof DIFFICULTY_LABEL
  minutes?: number
}) {
  return (
    <Link
      to={to}
      className={`flex items-start gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2.5 hover:border-[var(--border-strong)] ${
        nested ? 'ml-5 border-dashed py-2' : ''
      }`}
    >
      <span className="min-w-0 flex-1">
        <span className={`block font-medium leading-snug ${nested ? 'text-sm text-[var(--text-muted)]' : 'text-[var(--heading)]'}`}>
          {title}
        </span>
        {summary && !nested && (
          <span className="mt-0.5 line-clamp-2 block text-[13px] leading-relaxed text-[var(--text-muted)]">{summary}</span>
        )}
        <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11.5px] text-[var(--text-faint)]">
          {lessonReady ? (
            <span className="font-medium text-[var(--accent)]">{nested ? 'In lesson' : 'Full lesson'}</span>
          ) : (
            <span>{notesReady ? 'Notes' : 'Outline'}</span>
          )}
          {difficulty && !nested && <span>{DIFFICULTY_LABEL[difficulty]}</span>}
          {minutes && !nested ? <span>~{minutes} min</span> : null}
          {!nested && <span>{PRIORITY_LABEL[priority]}</span>}
          {executionPriority === 'p0' && !nested && <span title="Highest priority for the current plan">P0</span>}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5 pt-0.5">
        {extra}
        <StatusBadge status={status} />
      </span>
    </Link>
  )
}
