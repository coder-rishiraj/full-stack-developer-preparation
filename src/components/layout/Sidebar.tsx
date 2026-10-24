import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { TRACKS, TOPICS, getSectionsByTrack, getTopicMeta } from '@/content/taxonomy'
import { hasLesson } from '@/content/lessons'
import { trackProgress } from '@/domain/progress-selectors'
import { useUserStore } from '@/stores/user-store'
import type { StudyStatus, TopicMeta, TrackId } from '@/domain/types'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
    isActive
      ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
      : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)]'
  }`

const PRACTICE = [
  { to: '/dsa', label: 'DSA Problems' },
  { to: '/revision', label: 'Revision' },
  { to: '/interview', label: 'Interview Prep' },
  { to: '/capstone', label: 'Capstone Projects' },
]

const LIBRARY = [
  { to: '/favorites', label: 'Favorites' },
  { to: '/print', label: 'Print Center' },
  { to: '/settings', label: 'Settings' },
]

function GroupLabel({ children }: { children: string }) {
  return (
    <div className="mb-1 mt-4 px-2.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">
      {children}
    </div>
  )
}

/** Which track the current route belongs to (track page or topic page). */
function useActiveTrack(): { track?: TrackId; topicId?: string } {
  const { pathname } = useLocation()
  const t = pathname.match(/^\/tracks\/([A-E])/)
  if (t) return { track: t[1] as TrackId }
  const p = pathname.match(/^\/topics\/([^/]+)/)
  if (p) {
    const meta = getTopicMeta(decodeURIComponent(p[1]))
    if (meta) return { track: meta.track, topicId: meta.id }
  }
  return {}
}

export function Sidebar() {
  const state = useUserStore()
  const progress = trackProgress(state)
  const { track, topicId } = useActiveTrack()

  return (
    <aside
      data-sidebar
      className="print-hidden flex h-full w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)]"
    >
      <Link to="/" className="block border-b border-[var(--border)] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-md bg-[var(--accent)] font-[family-name:var(--font-serif)] text-[15px] font-bold text-[var(--accent-contrast)]"
          >
            C
          </span>
          <div>
            <div className="text-[14px] font-semibold leading-tight text-[var(--heading)]">Career Duo</div>
            <div className="text-[11px] leading-tight text-[var(--text-faint)]">Software engineering, taught</div>
          </div>
        </div>
      </Link>

      <nav className="cd-scroll flex-1 overflow-y-auto px-2 pb-4 pt-2" aria-label="Primary">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>

        <GroupLabel>Learning tracks</GroupLabel>
        <div className="space-y-0.5">
          {TRACKS.map((t) => (
            <NavLink key={t.id} to={`/tracks/${t.id}`} className={linkClass} title={t.name}>
              <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: t.accent }} aria-hidden />
              <span className="min-w-0 flex-1 truncate">{t.name}</span>
              <span className="text-[11px] tabular-nums text-[var(--text-faint)]">{progress[t.id]}%</span>
            </NavLink>
          ))}
        </div>

        {track && <CurriculumTree track={track} activeTopicId={topicId} />}

        <GroupLabel>Practice</GroupLabel>
        <div className="space-y-0.5">
          {PRACTICE.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <GroupLabel>Library</GroupLabel>
        <div className="space-y-0.5">
          {LIBRARY.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  )
}

const DONE: StudyStatus[] = ['first_pass', 'interview_ready']

function StatusDot({ status }: { status: StudyStatus }) {
  const done = DONE.includes(status)
  const active = status === 'learning' || status === 'needs_revision'
  return (
    <span
      aria-label={done ? 'Completed' : active ? 'In progress' : 'Not started'}
      className="mt-[5px] inline-block h-[7px] w-[7px] shrink-0 rounded-full border"
      style={{
        borderColor: done || active ? 'var(--accent)' : 'var(--border-strong)',
        background: done ? 'var(--accent)' : active ? 'color-mix(in srgb, var(--accent) 35%, transparent)' : 'transparent',
      }}
    />
  )
}

function CurriculumTree({ track, activeTopicId }: { track: TrackId; activeTopicId?: string }) {
  const topics = useUserStore((s) => s.topics)
  const sections = getSectionsByTrack(track)
  const trackInfo = TRACKS.find((t) => t.id === track)!

  const bySection = useMemo(() => {
    const map = new Map<string, TopicMeta[]>()
    for (const t of TOPICS) {
      if (t.track !== track || t.curriculumLevel !== 'classified-item') continue
      const list = map.get(t.sectionId) ?? []
      list.push(t)
      map.set(t.sectionId, list)
    }
    return map
  }, [track])

  const active = activeTopicId ? getTopicMeta(activeTopicId) : undefined
  const activeSection = active?.sectionId
  const activeParent = active?.parentTopicId ?? active?.id
  const [open, setOpen] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (activeSection) setOpen((o) => ({ ...o, [activeSection]: true }))
  }, [activeSection])

  // Keep the current topic in view when navigating with prev/next.
  useEffect(() => {
    if (!activeTopicId) return
    const el = document.querySelector(`[data-tree-topic="${CSS.escape(activeTopicId)}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeTopicId])

  return (
    <div className="mt-4">
      <div className="mb-1 flex items-baseline justify-between px-2.5">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">
          {trackInfo.shortName} curriculum
        </span>
        <span className="text-[10.5px] text-[var(--text-faint)]">{sections.length} modules</span>
      </div>
      <ul className="space-y-px">
        {sections.map((section) => {
          const items = bySection.get(section.id) ?? []
          const isOpen = open[section.id] ?? false
          const done = items.filter((t) => DONE.includes(topics[t.id]?.status ?? 'not_started')).length
          return (
            <li key={section.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen((o) => ({ ...o, [section.id]: !isOpen }))}
                className={`flex w-full items-start gap-1.5 rounded-md px-2 py-1 text-left text-[12.5px] leading-snug hover:bg-[var(--bg-muted)] ${
                  section.id === activeSection ? 'text-[var(--heading)]' : 'text-[var(--text-muted)]'
                }`}
              >
                <span aria-hidden className="mt-px w-3 shrink-0 text-[10px] text-[var(--text-faint)]">
                  {isOpen ? '▾' : '▸'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mr-1 font-mono text-[10.5px] text-[var(--text-faint)]">{section.id}</span>
                  {section.title}
                </span>
                {items.length > 0 && (
                  <span className="shrink-0 pt-px text-[10px] tabular-nums text-[var(--text-faint)]">
                    {done}/{items.length}
                  </span>
                )}
              </button>
              {isOpen && (
                <ul className="mb-1 ml-[18px] space-y-px border-l border-[var(--border)] pl-1.5">
                  {items.map((t) => (
                    <TreeTopic
                      key={t.id}
                      topic={t}
                      activeTopicId={activeTopicId}
                      expanded={t.id === activeParent}
                      status={topics[t.id]?.status ?? 'not_started'}
                    />
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function TreeTopic({
  topic,
  activeTopicId,
  expanded,
  status,
}: {
  topic: TopicMeta
  activeTopicId?: string
  expanded: boolean
  status: StudyStatus
}) {
  const topics = useUserStore((s) => s.topics)
  const children = useMemo(
    () => (expanded ? TOPICS.filter((t) => t.parentTopicId === topic.id) : []),
    [expanded, topic.id],
  )
  const isActive = activeTopicId === topic.id
  return (
    <li>
      <Link
        to={`/topics/${topic.id}`}
        data-tree-topic={topic.id}
        aria-current={isActive ? 'page' : undefined}
        className={`flex items-start gap-1.5 rounded px-1.5 py-[3px] text-[12.5px] leading-snug ${
          isActive
            ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
            : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)]'
        }`}
      >
        <StatusDot status={status} />
        <span className="min-w-0 flex-1">{topic.title}</span>
        {hasLesson(topic.id) && (
          <span className="mt-[3px] shrink-0 text-[9.5px] font-semibold uppercase tracking-wide text-[var(--accent)]" title="Full lesson available">
            lesson
          </span>
        )}
      </Link>
      {children.length > 0 && (
        <ul className="ml-3 space-y-px border-l border-[var(--border)] pl-1.5">
          {children.map((c) => (
            <li key={c.id}>
              <Link
                to={`/topics/${c.id}`}
                data-tree-topic={c.id}
                aria-current={activeTopicId === c.id ? 'page' : undefined}
                className={`flex items-start gap-1.5 rounded px-1.5 py-[2px] text-[12px] leading-snug ${
                  activeTopicId === c.id
                    ? 'font-medium text-[var(--accent)]'
                    : 'text-[var(--text-faint)] hover:text-[var(--text)]'
                }`}
              >
                <StatusDot status={topics[c.id]?.status ?? 'not_started'} />
                <span className="min-w-0 flex-1">{c.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
