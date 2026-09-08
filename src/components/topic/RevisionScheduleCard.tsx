import { getRevisionBucket } from '@/domain/revision'
import { nextPendingSlot } from '@/domain/revision-schedule'
import type { TopicProgress } from '@/domain/types'

function formatDate(value: string): string {
  return new Date(`${value}T12:00:00`).toLocaleDateString()
}

export function RevisionScheduleCard({
  progress,
  onRevise,
  onReschedule,
}: {
  progress: TopicProgress
  onRevise: () => void
  onReschedule: () => void
}) {
  const schedule = progress.revisionSchedule ?? []
  if (schedule.length === 0) {
    return (
      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
        <h2 className="font-semibold">Revision schedule</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Mark this topic as Learning or First Pass to populate the revision
          calendar: same day, next day, day 3, next Sundays, month-end Sunday,
          quarter Sunday, and pre-interview (when an interview date is set).
        </p>
      </section>
    )
  }

  const pending = nextPendingSlot(schedule)
  const done = schedule.filter((slot) => slot.completedAt).length

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold">Revision schedule</h2>
          <p className="text-sm text-[var(--text-muted)]">
            {done}/{schedule.length} completed
            {pending
              ? ` · next ${pending.name} on ${formatDate(pending.date)}`
              : ' · all steps done'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded border border-[var(--border)] px-2 py-1 text-xs"
            onClick={onRevise}
            disabled={!pending}
          >
            Mark this revision done
          </button>
          <button
            type="button"
            className="rounded border border-[var(--border)] px-2 py-1 text-xs"
            onClick={onReschedule}
          >
            Reschedule from today
          </button>
        </div>
      </div>
      <ol className="mt-3 space-y-1.5">
        {schedule.map((slot) => {
          const bucket = getRevisionBucket(
            new Date(`${slot.date}T12:00:00`).toISOString(),
          )
          const current = pending?.id === slot.id
          return (
            <li
              key={slot.id}
              className={`grid grid-cols-[6.5rem_7.5rem_minmax(0,1fr)] items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                slot.completedAt
                  ? 'text-[var(--text-faint)] line-through'
                  : current
                    ? 'bg-[var(--accent-soft)]'
                    : ''
              }`}
            >
              <span className="tabular-nums">{formatDate(slot.date)}</span>
              <span className="font-medium">{slot.name}</span>
              <span className="truncate text-xs text-[var(--text-muted)]">
                {slot.task}
                {current && bucket !== 'later' && bucket !== 'none'
                  ? ` · ${bucket.replace('_', ' ')}`
                  : ''}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
