import { Link } from 'react-router-dom'
import { getRevisionBucket } from '@/domain/revision'
import {
  DEFAULT_REVISION_RULES,
  isStudiedStatus,
  toDateOnly,
} from '@/domain/revision-schedule'
import { getTopicProgress } from '@/domain/progress-selectors'
import { allVisibleTopics } from '@/domain/user-content'
import { useUserStore } from '@/stores/user-store'
import { useMemo, useState } from 'react'
import type { RevisionSlot, TrackId } from '@/domain/types'

const REV_COLUMNS = DEFAULT_REVISION_RULES.map((rule) => ({
  id: rule.id,
  label: shortRevLabel(rule.id, rule.name),
  title: rule.task,
}))

function shortRevLabel(id: string, name: string): string {
  switch (id) {
    case 'rev1':
      return 'Rev 1\nSame day'
    case 'rev2':
      return 'Rev 2\nNext day'
    case 'rev3':
      return 'Rev 3\nDay 3'
    case 'rev4':
      return 'Rev 4\nSunday'
    case 'rev5':
      return 'Rev 5\n2nd Sunday'
    case 'rev6':
      return 'Rev 6\nMonth-end Sun'
    case 'rev7':
      return 'Rev 7\nQuarter Sun'
    case 'rev8':
      return 'Rev 8\nPre-interview'
    default:
      return name
  }
}

function formatShortDate(value: string): string {
  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  })
}

function studyDateFor(progress: {
  firstStudied?: string
  lastStudied?: string
  revisionSchedule?: RevisionSlot[]
}): string | undefined {
  if (progress.firstStudied) return toDateOnly(new Date(progress.firstStudied))
  if (progress.lastStudied) return toDateOnly(new Date(progress.lastStudied))
  const rev1 = progress.revisionSchedule?.find((slot) => slot.id === 'rev1')
  return rev1?.date
}

function slotTone(slot: RevisionSlot | undefined): string {
  if (!slot) return 'text-[var(--text-faint)]'
  if (slot.completedAt) return 'text-[var(--text-faint)] line-through'
  const bucket = getRevisionBucket(new Date(`${slot.date}T12:00:00`).toISOString())
  if (bucket === 'overdue') return 'font-semibold text-[var(--danger)]'
  if (bucket === 'due_today') return 'font-semibold text-[var(--accent)]'
  return 'text-[var(--text)]'
}

export function RevisionPage() {
  const state = useUserStore()
  const interviewDate = useUserStore((s) => s.interviewDate)
  const setInterviewDate = useUserStore((s) => s.setInterviewDate)
  const [track, setTrack] = useState<TrackId | ''>('')

  const rows = useMemo(() => {
    return allVisibleTopics(state)
      .map((topic) => {
        const progress = getTopicProgress(state, topic.id)
        return { topic, progress, studyDate: studyDateFor(progress) }
      })
      .filter(({ topic, progress }) => {
        if (track && topic.track !== track) return false
        return (
          (progress.revisionSchedule?.length ?? 0) > 0 ||
          isStudiedStatus(progress.status) ||
          progress.status === 'needs_revision'
        )
      })
      .sort((a, b) => {
        const da = a.studyDate ?? ''
        const db = b.studyDate ?? ''
        return db.localeCompare(da) || a.topic.title.localeCompare(b.topic.title)
      })
  }, [state, track])

  return (
    <div className="mx-auto max-w-[100rem] space-y-4 px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Revision</h1>
          <p className="text-sm text-[var(--text-muted)]">
            When you mark a topic Learning or First Pass, it enters this calendar
            with Rev 1–7 filled. Set an interview date to fill Rev 8.
          </p>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs text-[var(--text-muted)]">Interview date</span>
          <input
            type="date"
            className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5"
            value={interviewDate ?? ''}
            onChange={(event) =>
              setInterviewDate(event.target.value || undefined)
            }
          />
        </label>
      </div>

      <div className="print-hidden flex flex-wrap items-center gap-2" data-screen-only>
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={track}
          onChange={(event) => setTrack(event.target.value as TrackId | '')}
          aria-label="Filter by track"
        >
          <option value="">All tracks</option>
          {(['A', 'B', 'C', 'D', 'E'] as TrackId[]).map((id) => (
            <option key={id} value={id}>
              Track {id}
            </option>
          ))}
        </select>
        <Link to="/print/revision" className="text-sm text-[var(--accent)] underline">
          Print revision sheet
        </Link>
        <span className="text-xs text-[var(--text-faint)]">
          {rows.length} studied topic{rows.length === 1 ? '' : 's'}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          No studied topics yet. Open any topic and mark it Learning or First Pass
          — it will appear here with all revision dates filled.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-[var(--bg-muted)] text-[11px] uppercase tracking-wide text-[var(--text-faint)]">
              <tr>
                <th className="sticky left-0 z-10 bg-[var(--bg-muted)] px-3 py-2 font-semibold">
                  Topic
                </th>
                <th className="whitespace-nowrap px-3 py-2 font-semibold">Study date</th>
                {REV_COLUMNS.map((col) => (
                  <th
                    key={col.id}
                    title={col.title}
                    className="whitespace-pre-line px-3 py-2 text-center font-semibold normal-case tracking-normal"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ topic, progress, studyDate }) => {
                const byId = new Map(
                  (progress.revisionSchedule ?? []).map((slot) => [slot.id, slot]),
                )
                return (
                  <tr
                    key={topic.id}
                    className="border-t border-[var(--border)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-muted)]/60"
                  >
                    <td className="sticky left-0 z-10 max-w-[16rem] bg-[var(--bg-elevated)] px-3 py-2">
                      <Link
                        className="font-medium text-[var(--accent)] hover:underline"
                        to={`/topics/${topic.id}/revision`}
                      >
                        {topic.title}
                      </Link>
                      <div className="text-[11px] text-[var(--text-faint)]">
                        Track {topic.track} · {topic.sectionId}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 tabular-nums text-[var(--text)]">
                      {studyDate ? formatShortDate(studyDate) : '—'}
                    </td>
                    {REV_COLUMNS.map((col) => {
                      const slot = byId.get(col.id)
                      return (
                        <td
                          key={col.id}
                          className={`whitespace-nowrap px-3 py-2 text-center tabular-nums ${slotTone(slot)}`}
                          title={
                            slot
                              ? `${slot.name}${slot.completedAt ? ' · done' : ''}${
                                  slot.clashBumped ? ' · date adjusted for clash' : ''
                                }`
                              : col.id === 'rev8' && !interviewDate
                                ? 'Set an interview date to schedule Rev 8'
                                : undefined
                          }
                        >
                          {slot ? formatShortDate(slot.date) : '—'}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
