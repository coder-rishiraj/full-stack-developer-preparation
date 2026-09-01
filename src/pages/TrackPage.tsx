import { Link, useParams } from 'react-router-dom'
import { getTrack, getTopicsByTrack, TRACKS, getSectionsByTrack } from '@/content/taxonomy'
import {
  countDisplaySection,
  groupSectionsForDisplay,
  topicsInDisplaySection,
} from '@/content/section-display'
import { getTopicProgress } from '@/domain/progress-selectors'
import { customTopicToMeta, listCustomTopics } from '@/domain/user-content'
import { Badge } from '@/components/ui/Badge'
import { TopicListRow } from '@/components/topic/TopicListRow'
import { useUserStore } from '@/stores/user-store'
import type { TrackId } from '@/domain/types'

export function TrackPage() {
  const { trackId } = useParams()
  const state = useUserStore()
  const track = getTrack(trackId ?? '')
  const topics = getTopicsByTrack(trackId ?? '')
  const sections = getSectionsByTrack(trackId ?? '')
  const customForTrack = listCustomTopics(state)
    .filter((t) => t.track === (trackId as TrackId))
    .map(customTopicToMeta)

  if (!track) {
    return (
      <div className="p-6">
        <p>Unknown track.</p>
        <ul>
          {TRACKS.map((t) => (
            <li key={t.id}>
              <Link to={`/tracks/${t.id}`}>Track {t.id}</Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const ready = topics.filter((t) => t.contentReady).length

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-6">
      <div>
        <div
          className="mb-2 h-1 w-16 rounded"
          style={{ background: track.accent }}
          aria-hidden
        />
        <h1 className="text-2xl font-semibold">
          Track {track.id} — {track.name}
        </h1>
        <p className="text-sm text-[var(--text-muted)]">{track.description}</p>
        <p className="mt-2 text-xs text-[var(--text-faint)]">
          {topics.length} curriculum topics · {customForTrack.length} custom ·{' '}
          {groupSectionsForDisplay(sections).length} sections · {ready} with deep notes
        </p>
      </div>

      {customForTrack.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)]">
            My Topics
          </h2>
          <ul className="space-y-2">
            {customForTrack.map((t) => {
              const p = getTopicProgress(state, t.id)
              return (
                <li key={t.id}>
                  <TopicListRow
                    to={`/topics/${t.id}`}
                    title={t.title}
                    priority={t.priority}
                    executionPriority={t.executionPriority}
                    status={p.status}
                    extra={<Badge tone="info">Custom</Badge>}
                  />
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {groupSectionsForDisplay(sections).map((group) => {
        const sectionTopics = topicsInDisplaySection(topics, group)
        if (sectionTopics.length === 0) return null
        const { classified, nested } = countDisplaySection(sectionTopics)
        const showGroupLabels = group.sections.length > 1
        return (
          <section key={group.id}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)]">
              {group.id} — {group.title}
              <span className="ml-2 font-normal normal-case tracking-normal">
                {classified} items
                {nested > 0 ? ` · ${nested} nested` : ''}
              </span>
            </h2>
            <ul className="space-y-2">
              {group.sections.flatMap((subsection) => {
                const rows = sectionTopics.filter((t) => t.sectionId === subsection.id)
                if (rows.length === 0) return []
                return [
                  showGroupLabels ? (
                    <li
                      key={`${subsection.id}-label`}
                      className="px-1 pt-3 first:pt-0"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                        {subsection.id} — {subsection.title}
                      </p>
                    </li>
                  ) : null,
                  ...rows.map((t) => {
                    const p = getTopicProgress(state, t.id)
                    return (
                      <li key={t.id}>
                        <TopicListRow
                          to={`/topics/${t.id}`}
                          title={t.title}
                          priority={t.priority}
                          executionPriority={t.executionPriority}
                          status={p.status}
                          notesReady={t.contentReady}
                          nested={t.curriculumLevel === 'nested-concept'}
                        />
                      </li>
                    )
                  }),
                ]
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
