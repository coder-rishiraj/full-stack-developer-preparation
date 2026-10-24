import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopicMeta } from '@/content/taxonomy'
import { getProblemsForTopic } from '@/content/problems'
import type { TopicMeta } from '@/domain/types'

export type OutlineItem = { id: string; level: 2 | 3 | 4; text: string }

/** Tracks which heading is currently being read inside #main-scroll. */
export function useActiveHeading(ids: string[]): string | undefined {
  const [active, setActive] = useState<string | undefined>(ids[0])
  const key = ids.join('|')

  useEffect(() => {
    const root = document.getElementById('main-scroll')
    if (!root || ids.length === 0) return
    const onScroll = () => {
      const top = root.getBoundingClientRect().top
      let current: string | undefined = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - top <= 96) current = id
        else break
      }
      setActive(current)
    }
    onScroll()
    root.addEventListener('scroll', onScroll, { passive: true })
    return () => root.removeEventListener('scroll', onScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return active
}

export function useReadingProgress(): number {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const root = document.getElementById('main-scroll')
    if (!root) return
    const onScroll = () => {
      const max = root.scrollHeight - root.clientHeight
      setPct(max > 0 ? Math.min(100, Math.round((root.scrollTop / max) * 100)) : 0)
    }
    onScroll()
    root.addEventListener('scroll', onScroll, { passive: true })
    return () => root.removeEventListener('scroll', onScroll)
  }, [])
  return pct
}

export function scrollToHeading(id: string, smooth = true) {
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  if (location.hash !== `#${id}`) history.replaceState(history.state, '', `#${id}`)
  return true
}

export function TableOfContents({ outline, title = 'On this page' }: { outline: OutlineItem[]; title?: string }) {
  const items = outline.filter((o) => o.level <= 3)
  const active = useActiveHeading(items.map((i) => i.id))
  if (items.length === 0) return null
  return (
    <nav aria-label="Table of contents" className="cd-toc">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">{title}</div>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          data-level={item.level}
          aria-current={active === item.id ? 'true' : undefined}
          onClick={(e) => {
            e.preventDefault()
            scrollToHeading(item.id)
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  )
}

function TopicLinkList({ title, ids }: { title: string; ids: string[] }) {
  const metas = ids.map((id) => getTopicMeta(id)).filter((m): m is TopicMeta => Boolean(m))
  if (metas.length === 0) return null
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">{title}</div>
      <ul className="space-y-1">
        {metas.map((m) => (
          <li key={m.id}>
            <Link to={`/topics/${m.id}`} className="block text-[12.5px] leading-snug text-[var(--text-muted)] hover:text-[var(--accent)]">
              {m.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function interviewLinkFor(meta: TopicMeta): { to: string; label: string } {
  if (meta.track === 'C' && /^C(1|2|3)\b/.test(meta.sectionId)) return { to: '/interview/java', label: 'Java interview questions' }
  if (meta.track === 'B' && meta.sectionId.startsWith('B4')) return { to: '/interview/react', label: 'React interview questions' }
  return { to: '/interview', label: 'Interview preparation' }
}

export function LessonRail({
  meta,
  outline,
  outlineTitle,
}: {
  meta: TopicMeta
  outline: OutlineItem[]
  outlineTitle?: string
}) {
  const pct = useReadingProgress()
  const problems = getProblemsForTopic(meta.id)
  const interview = interviewLinkFor(meta)
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 flex items-baseline justify-between text-[11px] text-[var(--text-faint)]">
          <span className="font-semibold uppercase tracking-[0.1em]">Progress</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-muted)]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress">
          <div className="h-full rounded-full bg-[var(--accent)] transition-[width]" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <TableOfContents outline={outline} title={outlineTitle} />
      <TopicLinkList title="Before this" ids={meta.prerequisites} />
      <TopicLinkList title="Related" ids={meta.relatedTopics} />
      <TopicLinkList title="Learn next" ids={meta.nextTopics} />
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">Practise</div>
        {problems.length > 0 && (
          <Link to={`/dsa?topic=${encodeURIComponent(meta.id)}`} className="block text-[12.5px] text-[var(--text-muted)] hover:text-[var(--accent)]">
            {problems.length} related problem{problems.length === 1 ? '' : 's'}
          </Link>
        )}
        <Link to={interview.to} className="block text-[12.5px] text-[var(--text-muted)] hover:text-[var(--accent)]">
          {interview.label}
        </Link>
        <Link to={`/topics/${meta.id}/revision`} className="block text-[12.5px] text-[var(--text-muted)] hover:text-[var(--accent)]">
          Revision sheet
        </Link>
      </div>
    </div>
  )
}
