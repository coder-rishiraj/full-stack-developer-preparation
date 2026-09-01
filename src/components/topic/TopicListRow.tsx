import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { ExecutionPriority, Priority, StudyStatus } from '@/domain/types'
import {
  Badge,
  ExecutionPriorityBadge,
  PriorityBadge,
  StatusBadge,
} from '@/components/ui/Badge'

export const TOPIC_BADGE_COLS =
  'grid-cols-[minmax(0,1fr)_5.75rem_6.5rem_8.25rem_6.75rem]'

export function TopicListRow({
  to,
  title,
  priority,
  executionPriority,
  status,
  notesReady,
  nested,
  extra,
}: {
  to: string
  title: string
  priority: Priority
  executionPriority: ExecutionPriority
  status: StudyStatus
  notesReady?: boolean
  nested?: boolean
  extra?: ReactNode
}) {
  return (
    <Link
      to={to}
      className={`grid ${TOPIC_BADGE_COLS} items-center gap-x-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 hover:border-[var(--border-strong)]`}
    >
      <span
        className={`min-w-0 truncate font-medium ${nested ? 'pl-4 text-[var(--text-muted)]' : ''}`}
      >
        {title}
      </span>
      <span className="justify-self-start">
        <PriorityBadge priority={priority} />
      </span>
      <span className="justify-self-start">
        <ExecutionPriorityBadge priority={executionPriority} />
      </span>
      <span className="justify-self-start">
        <StatusBadge status={status} />
      </span>
      <span className="flex min-w-0 items-center justify-self-start gap-1.5 whitespace-nowrap">
        {notesReady === true && <Badge tone="success">Notes ready</Badge>}
        {notesReady === false && <Badge tone="neutral">Meta only</Badge>}
        {extra}
      </span>
    </Link>
  )
}
