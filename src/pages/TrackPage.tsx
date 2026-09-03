import { useEffect, useState } from 'react'
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
import { Button } from '@/components/ui/Button'
import { TopicListRow } from '@/components/topic/TopicListRow'
import { useUserStore } from '@/stores/user-store'
import type { TopicMeta, TrackId } from '@/domain/types'

function setOpenItem(
  current: Set<string>,
  id: string,
  open: boolean,
): Set<string> {
  const next = new Set(current)
  if (open) next.add(id)
  else next.delete(id)
  return next
}

export function TrackPage() {
  const { trackId } = useParams()
  const state = useUserStore()
  const track = getTrack(trackId ?? '')
  const topics = getTopicsByTrack(trackId ?? '')
  const sections = getSectionsByTrack(trackId ?? '')
  const displayGroups = groupSectionsForDisplay(sections)
  const groupIds = displayGroups.map((group) => group.id)
  const subsectionIds = displayGroups.flatMap((group) =>
    group.sections.map((section) => section.id),
  )
  const expansionKey = `${trackId ?? ''}:${groupIds.join(',')}:${subsectionIds.join(',')}`
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(),
  )
  const [openSubsections, setOpenSubsections] = useState<Set<string>>(
    () => new Set(),
  )
  const customForTrack = listCustomTopics(state)
    .filter((t) => t.track === (trackId as TrackId))
    .map(customTopicToMeta)

  useEffect(() => {
    setOpenGroups(new Set())
    setOpenSubsections(new Set())
  }, [expansionKey])

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
  const allExpanded =
    groupIds.every((id) => openGroups.has(id)) &&
    subsectionIds.every((id) => openSubsections.has(id))
  const allCollapsed =
    groupIds.every((id) => !openGroups.has(id)) &&
    subsectionIds.every((id) => !openSubsections.has(id))

  const renderTopicRows = (rows: TopicMeta[]) =>
    rows.map((topic) => {
      const progress = getTopicProgress(state, topic.id)
      return (
        <li key={topic.id}>
          <TopicListRow
            to={`/topics/${topic.id}`}
            title={topic.title}
            priority={topic.priority}
            executionPriority={topic.executionPriority}
            status={progress.status}
            notesReady={topic.contentReady}
            nested={topic.curriculumLevel === 'nested-concept'}
          />
        </li>
      )
    })

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
          {displayGroups.length} sections · {ready} with deep notes
        </p>
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Curriculum section controls">
          <Button
            size="sm"
            type="button"
            disabled={allExpanded}
            onClick={() => {
              setOpenGroups(new Set(groupIds))
              setOpenSubsections(new Set(subsectionIds))
            }}
          >
            Expand all
          </Button>
          <Button
            size="sm"
            type="button"
            disabled={allCollapsed}
            onClick={() => {
              setOpenGroups(new Set())
              setOpenSubsections(new Set())
            }}
          >
            Collapse all
          </Button>
        </div>
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

      {displayGroups.map((group) => {
        const sectionTopics = topicsInDisplaySection(topics, group)
        if (sectionTopics.length === 0) return null
        const { classified, nested } = countDisplaySection(sectionTopics)
        const hasSubsections = group.sections.length > 1
        const groupOpen = openGroups.has(group.id)
        return (
          <details
            key={group.id}
            open={groupOpen}
            className="group/track"
          >
            <summary
              className="mb-2 flex cursor-pointer list-none items-center gap-2 rounded-md bg-[var(--bg-muted)] px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)] hover:text-[var(--text)] [&::-webkit-details-marker]:hidden"
              onClick={(event) => {
                event.preventDefault()
                setOpenGroups((current) =>
                  setOpenItem(current, group.id, !groupOpen),
                )
              }}
            >
              <span
                aria-hidden
                className="inline-block text-[10px] transition-transform group-open/track:rotate-90"
              >
                ▶
              </span>
              <h2 className="inline">
                {group.id} — {group.title}
              </h2>
              <span className="font-normal normal-case tracking-normal">
                {classified} items
                {nested > 0 ? ` · ${nested} nested` : ''}
              </span>
            </summary>

            {groupOpen &&
              (hasSubsections ? (
                <div className="space-y-3 pl-2 md:pl-4">
                  {group.sections.map((subsection) => {
                    const rows = sectionTopics.filter(
                      (topic) => topic.sectionId === subsection.id,
                    )
                    if (rows.length === 0) return null
                    const counts = countDisplaySection(rows)
                    const subsectionOpen = openSubsections.has(subsection.id)
                    return (
                      <details
                        key={subsection.id}
                        open={subsectionOpen}
                        className="group/subsection"
                      >
                        <summary
                          className="mb-2 flex cursor-pointer list-none items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-faint)] hover:border-[var(--border-strong)] hover:text-[var(--text)] [&::-webkit-details-marker]:hidden"
                          onClick={(event) => {
                            event.preventDefault()
                            setOpenSubsections((current) =>
                              setOpenItem(
                                current,
                                subsection.id,
                                !subsectionOpen,
                              ),
                            )
                          }}
                        >
                          <span
                            aria-hidden
                            className="inline-block text-[9px] transition-transform group-open/subsection:rotate-90"
                          >
                            ▶
                          </span>
                          <h3 className="inline">
                            {subsection.id} — {subsection.title}
                          </h3>
                          <span className="font-normal normal-case tracking-normal">
                            {counts.classified} items
                            {counts.nested > 0 ? ` · ${counts.nested} nested` : ''}
                          </span>
                        </summary>
                        {subsectionOpen && (
                          <ul className="space-y-2 pl-2">{renderTopicRows(rows)}</ul>
                        )}
                      </details>
                    )
                  })}
                </div>
              ) : (
                <ul className="space-y-2">
                  {renderTopicRows(sectionTopics)}
                </ul>
              ))}
          </details>
        )
      })}
    </div>
  )
}
