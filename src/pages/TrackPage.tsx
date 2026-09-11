import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getTrack, getTopicsByTrack, TRACKS, getSectionsByTrack } from '@/content/taxonomy'
import {
  countDisplaySection,
  groupSectionsForDisplay,
  topicsInDisplaySection,
  type DisplaySection,
} from '@/content/section-display'
import { getTopicProgress } from '@/domain/progress-selectors'
import {
  customTopicToMeta,
  isCustomSectionId,
  listCustomTopicsFromMap,
} from '@/domain/user-content'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AddCustomTopicControl } from '@/components/topic/AddCustomTopicControl'
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

function expansionStorageKey(trackId: string) {
  return `se-prep:track-expansion:${trackId}`
}

function readStoredExpansion(trackId: string): {
  groups: string[]
  subsections: string[]
} {
  try {
    const raw = sessionStorage.getItem(expansionStorageKey(trackId))
    if (!raw) return { groups: [], subsections: [] }
    const parsed = JSON.parse(raw) as {
      groups?: string[]
      subsections?: string[]
    }
    return {
      groups: Array.isArray(parsed.groups) ? parsed.groups : [],
      subsections: Array.isArray(parsed.subsections) ? parsed.subsections : [],
    }
  } catch {
    return { groups: [], subsections: [] }
  }
}

function writeStoredExpansion(
  trackId: string,
  groups: Set<string>,
  subsections: Set<string>,
) {
  try {
    sessionStorage.setItem(
      expansionStorageKey(trackId),
      JSON.stringify({
        groups: [...groups],
        subsections: [...subsections],
      }),
    )
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function findGroupForSection(
  groups: DisplaySection[],
  sectionId: string,
): DisplaySection | undefined {
  return groups.find((group) =>
    group.sections.some((section) => section.id === sectionId),
  )
}

function filterToKnown(ids: string[], known: Set<string>) {
  return ids.filter((id) => known.has(id))
}

function customDisplayGroups(
  customTopics: TopicMeta[],
  curriculumSectionIds: Set<string>,
): DisplaySection[] {
  const bySection = new Map<string, TopicMeta[]>()
  for (const topic of customTopics) {
    if (curriculumSectionIds.has(topic.sectionId)) continue
    const list = bySection.get(topic.sectionId) ?? []
    list.push(topic)
    bySection.set(topic.sectionId, list)
  }

  return [...bySection.entries()]
    .sort((a, b) => a[1][0]!.sectionTitle.localeCompare(b[1][0]!.sectionTitle))
    .map(([sectionId, topics]) => ({
      id: sectionId,
      title: topics[0]!.sectionTitle,
      sections: [{ id: sectionId, title: topics[0]!.sectionTitle }],
    }))
}

export function TrackPage() {
  const { trackId } = useParams()
  const [searchParams] = useSearchParams()
  const focusSection = searchParams.get('section') ?? ''
  const state = useUserStore()
  const track = getTrack(trackId ?? '')
  const sections = getSectionsByTrack(trackId ?? '')
  const customTopicsMap = useUserStore((s) => s.customTopics)
  const customForTrack = useMemo(
    () =>
      listCustomTopicsFromMap(customTopicsMap)
        .filter((t) => t.track === (trackId as TrackId))
        .map(customTopicToMeta),
    [customTopicsMap, trackId],
  )
  const curriculumTopics = useMemo(
    () => getTopicsByTrack(trackId ?? ''),
    [trackId],
  )
  const topics = useMemo(
    () => [...curriculumTopics, ...customForTrack],
    [curriculumTopics, customForTrack],
  )
  const curriculumSectionIds = useMemo(
    () => new Set(sections.map((section) => section.id)),
    [sections],
  )
  const displayGroups = useMemo(() => {
    const curriculumGroups = groupSectionsForDisplay(sections)
    const customGroups = customDisplayGroups(customForTrack, curriculumSectionIds)
    return [...curriculumGroups, ...customGroups]
  }, [sections, customForTrack, curriculumSectionIds])
  const groupIds = displayGroups.map((group) => group.id)
  const subsectionIds = displayGroups.flatMap((group) =>
    group.sections.map((section) => section.id),
  )
  const expansionKey = `${trackId ?? ''}:${groupIds.join(',')}:${subsectionIds.join(',')}`
  const focusGroupId = useMemo(() => {
    if (!focusSection) return ''
    return findGroupForSection(displayGroups, focusSection)?.id ?? ''
  }, [displayGroups, focusSection])

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set())
  const [openSubsections, setOpenSubsections] = useState<Set<string>>(
    () => new Set(),
  )
  const [expansionReady, setExpansionReady] = useState(false)

  useEffect(() => {
    if (!trackId) return
    setExpansionReady(false)

    const knownGroupIds = new Set(groupIds)
    const knownSubsectionIds = new Set(subsectionIds)
    const stored = readStoredExpansion(trackId)
    const nextGroups = new Set(filterToKnown(stored.groups, knownGroupIds))
    const nextSubsections = new Set(
      filterToKnown(stored.subsections, knownSubsectionIds),
    )

    if (focusSection && focusGroupId) {
      nextGroups.add(focusGroupId)
      if (focusSection !== focusGroupId && knownSubsectionIds.has(focusSection)) {
        nextSubsections.add(focusSection)
      }
    } else if (focusSection && knownGroupIds.has(focusSection)) {
      nextGroups.add(focusSection)
    }

    setOpenGroups(nextGroups)
    setOpenSubsections(nextSubsections)
    setExpansionReady(true)
    // groupIds / subsectionIds are encoded in expansionKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expansionKey, trackId, focusSection, focusGroupId])

  useEffect(() => {
    if (!trackId || !expansionReady) return
    writeStoredExpansion(trackId, openGroups, openSubsections)
  }, [trackId, expansionReady, openGroups, openSubsections])

  useEffect(() => {
    if (!focusSection) return
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(`curriculum-section-${focusSection}`)
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [focusSection, openGroups, openSubsections])

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
      const isCustom = topic.id.startsWith('custom-')
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
            extra={isCustom ? <Badge tone="info">Custom</Badge> : undefined}
          />
        </li>
      )
    })

  function openAfterCreate(sectionId: string) {
    const group = findGroupForSection(displayGroups, sectionId)
    if (group) {
      setOpenGroups((current) => setOpenItem(current, group.id, true))
      if (sectionId !== group.id) {
        setOpenSubsections((current) => setOpenItem(current, sectionId, true))
      }
    } else if (isCustomSectionId(sectionId)) {
      setOpenGroups((current) => setOpenItem(current, sectionId, true))
    }
  }

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
          {curriculumTopics.length} curriculum topics · {customForTrack.length}{' '}
          custom · {displayGroups.length} sections · {ready} with deep notes
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Curriculum section controls">
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
          <AddCustomTopicControl
            trackId={track.id}
            mode="section"
            label="Add section"
            onCreated={(_topicId, sectionId) => openAfterCreate(sectionId)}
          />
        </div>
      </div>

      {displayGroups.map((group) => {
        const sectionTopics = topicsInDisplaySection(topics, group)
        const hasSubsections = group.sections.length > 1
        const looseRows = hasSubsections
          ? sectionTopics.filter((topic) => topic.sectionId === group.id)
          : []
        if (sectionTopics.length === 0 && !isCustomSectionId(group.id)) return null
        const { classified, nested } = countDisplaySection(sectionTopics)
        const groupOpen = openGroups.has(group.id)
        const groupLabel = isCustomSectionId(group.id)
          ? group.title
          : `${group.id} — ${group.title}`
        const defaultSectionId = hasSubsections ? group.id : group.sections[0]?.id ?? group.id
        const defaultSectionTitle = hasSubsections
          ? groupLabel
          : `${group.sections[0]?.id ?? group.id} — ${group.sections[0]?.title ?? group.title}`
        return (
          <details
            key={group.id}
            id={`curriculum-section-${group.id}`}
            open={groupOpen}
            className="group/track scroll-mt-4"
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
              <h2 className="inline">{groupLabel}</h2>
              {isCustomSectionId(group.id) && (
                <Badge tone="info">Custom section</Badge>
              )}
              <span className="font-normal normal-case tracking-normal">
                {classified} items
                {nested > 0 ? ` · ${nested} nested` : ''}
              </span>
            </summary>

            {groupOpen && (
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <AddCustomTopicControl
                  trackId={track.id}
                  sectionId={defaultSectionId}
                  sectionTitle={defaultSectionTitle}
                  label={hasSubsections ? 'Add topic to section' : 'Add topic'}
                  onCreated={(_id, sectionId) => openAfterCreate(sectionId)}
                />
                {group.id === 'A8' && (
                  <>
                    <Link
                      to="/print/graph-core"
                      className="text-sm text-[var(--accent)] underline"
                    >
                      Core algorithms (memorize)
                    </Link>
                    <Link
                      to="/print/graph-algorithms"
                      className="text-sm text-[var(--accent)] underline"
                    >
                      All graph topics
                    </Link>
                    <Link
                      to="/print/graphs"
                      className="text-sm text-[var(--accent)] underline"
                    >
                      Print full Graphs handbook
                    </Link>
                  </>
                )}
              </div>
            )}

            {groupOpen &&
              (hasSubsections ? (
                <div className="space-y-3 pl-2 md:pl-4">
                  {looseRows.length > 0 && (
                    <ul className="mb-3 space-y-2">{renderTopicRows(looseRows)}</ul>
                  )}
                  {group.sections.map((subsection) => {
                    const rows = sectionTopics.filter(
                      (topic) => topic.sectionId === subsection.id,
                    )
                    const counts = countDisplaySection(rows)
                    const subsectionOpen = openSubsections.has(subsection.id)
                    return (
                      <details
                        key={subsection.id}
                        id={`curriculum-section-${subsection.id}`}
                        open={subsectionOpen}
                        className="group/subsection scroll-mt-4"
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
                          <div className="space-y-2 pl-2">
                            <AddCustomTopicControl
                              trackId={track.id}
                              sectionId={subsection.id}
                              sectionTitle={`${subsection.id} — ${subsection.title}`}
                              label="Add topic"
                              onCreated={(_id, sectionId) =>
                                openAfterCreate(sectionId)
                              }
                            />
                            {rows.length > 0 && (
                              <ul className="space-y-2">{renderTopicRows(rows)}</ul>
                            )}
                          </div>
                        )}
                      </details>
                    )
                  })}
                </div>
              ) : (
                <ul className="space-y-2">{renderTopicRows(sectionTopics)}</ul>
              ))}
          </details>
        )
      })}
    </div>
  )
}
