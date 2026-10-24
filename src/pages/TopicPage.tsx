import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getTopicMeta, getTopicNeighbors } from '@/content/taxonomy'
import { TopicHeader } from '@/components/topic/TopicHeader'
import { TopicBody } from '@/components/topic/TopicBody'
import { ExtraPointsEditor } from '@/components/topic/ExtraPointsEditor'
import { RevisionScheduleCard } from '@/components/topic/RevisionScheduleCard'
import { LessonBlocks } from '@/components/lesson/LessonBlocks'
import { LessonRail, TableOfContents, scrollToHeading, type OutlineItem } from '@/components/lesson/LessonRail'
import { getTopicProgress } from '@/domain/progress-selectors'
import {
  customTopicToContent,
  getCustomTopic,
  getOverlay,
  isCustomTopicId,
  resolveTopicMeta,
} from '@/domain/user-content'
import { useUserStore } from '@/stores/user-store'
import type { Confidence, StudyStatus, TopicContent, TopicMeta } from '@/domain/types'
import { PriorityBadge, TrackBadge, Badge } from '@/components/ui/Badge'
import { useTopicContent } from '@/hooks/useTopicContent'
import { useLesson } from '@/hooks/useLesson'
import type { ResolvedLesson } from '@/content/lessons'
import type { MdBlock } from '@/lib/lesson-markdown'
import { outlineOf, revisionBlocks } from '@/content/lessons/revision'

type Mode = 'full' | 'study' | 'revision'


export function TopicPage({ mode = 'full' }: { mode?: Mode }) {
  const { topicId = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const state = useUserStore()
  const meta = resolveTopicMeta(state, topicId)
  const custom = getCustomTopic(state, topicId)
  const isCustom = isCustomTopicId(topicId) && !!custom

  const { lesson, loading: lessonLoading } = useLesson(isCustom ? undefined : topicId)
  const { content: curriculumContent, loading: notesLoading } = useTopicContent(isCustom ? undefined : topicId)
  const overlay = getOverlay(state, topicId)

  const content = useMemo(() => {
    if (isCustom && custom) return customTopicToContent(custom, overlay)
    return curriculumContent
  }, [isCustom, custom, overlay, curriculumContent])

  const setTopicStatus = useUserStore((s) => s.setTopicStatus)
  const setTopicConfidence = useUserStore((s) => s.setTopicConfidence)
  const markTopicRevised = useUserStore((s) => s.markTopicRevised)
  const rescheduleTopic = useUserStore((s) => s.rescheduleTopic)
  const toggleBookmark = useUserStore((s) => s.toggleBookmark)
  const setNote = useUserStore((s) => s.setNote)
  const addOverlayPoint = useUserStore((s) => s.addOverlayPoint)
  const updateOverlayPoint = useUserStore((s) => s.updateOverlayPoint)
  const removeOverlayPoint = useUserStore((s) => s.removeOverlayPoint)
  const deleteCustomTopic = useUserStore((s) => s.deleteCustomTopic)
  const updateCustomTopic = useUserStore((s) => s.updateCustomTopic)
  const recordVisit = useUserStore((s) => s.recordVisit)
  const startLearning = useUserStore((s) => s.startLearning)
  const autoMark = useUserStore((s) => s.learning.autoMarkLearning)
  const defaultView = useUserStore((s) => s.learning.defaultView)
  const note = topicId ? (state.notes[topicId] ?? '') : ''

  const progress = getTopicProgress(state, topicId)
  const bookmarked = topicId ? state.bookmarks.includes(topicId) : false
  const nav = useMemo(() => (isCustom ? {} : getTopicNeighbors(topicId)), [topicId, isCustom])

  // Remember the visit; optionally move an untouched topic to "learning".
  useEffect(() => {
    if (!meta || mode === 'revision') return
    recordVisit(meta.id)
    if (autoMark && !isCustom) startLearning(meta.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta?.id, mode])

  // Start each topic at the top, or at the #anchor in the URL once it renders.
  const ready = !lessonLoading && !notesLoading
  useEffect(() => {
    if (!ready) return
    const hash = decodeURIComponent(location.hash.slice(1))
    if (hash) {
      // Jump instantly, then once more after diagrams and fonts have settled the layout.
      requestAnimationFrame(() => scrollToHeading(hash, false))
      const t = setTimeout(() => scrollToHeading(hash, false), 600)
      return () => clearTimeout(t)
    } else {
      document.getElementById('main-scroll')?.scrollTo({ top: 0 })
    }
  }, [ready, topicId, mode, location.hash])

  // "Open topics in focused study view" — the Lesson tab opts out with state.explicit.
  if (mode === 'full' && defaultView === 'study' && !(location.state as { explicit?: boolean } | null)?.explicit) {
    return <Navigate to={`/topics/${topicId}/study${location.hash}`} replace />
  }

  if (!meta) {
    return (
      <div className="p-6">
        <p>Topic not found.</p>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  const header = (
    <TopicHeader
      meta={meta}
      progress={progress}
      mode={mode}
      bookmarked={bookmarked}
      onStatus={(s: StudyStatus) => setTopicStatus(meta.id, s)}
      onConfidence={(c: Confidence) => setTopicConfidence(meta.id, c)}
      onRevise={() => markTopicRevised(meta.id)}
      onToggleBookmark={() => toggleBookmark(meta.id)}
      summary={lesson && !lesson.focus ? lesson.lesson.frontmatter.summary : undefined}
      difficulty={lesson?.lesson.frontmatter.difficulty}
      minutes={lesson && !lesson.focus ? lesson.lesson.frontmatter.minutes : undefined}
    />
  )

  const personalTools =
    mode === 'full' ? (
      <div className="space-y-6 pt-4">
        <RevisionScheduleCard
          progress={progress}
          onRevise={() => markTopicRevised(meta.id)}
          onReschedule={() => rescheduleTopic(meta.id)}
        />
        <ExtraPointsEditor
          overlay={overlay}
          onAdd={(field, text) => addOverlayPoint(meta.id, field, text)}
          onUpdate={(field, index, text) => updateOverlayPoint(meta.id, field, index, text)}
          onRemove={(field, index) => removeOverlayPoint(meta.id, field, index)}
        />
        <PersonalNotes note={note} onChange={(v) => setNote(meta.id, v)} />
      </div>
    ) : null

  const footer = !isCustom && (
    <LessonFooter
      meta={meta}
      mode={mode}
      completed={progress.status === 'first_pass' || progress.status === 'interview_ready'}
      onComplete={() => setTopicStatus(meta.id, 'first_pass')}
      nav={nav}
    />
  )

  // Loading
  if (!isCustom && (lessonLoading || (notesLoading && !lesson))) {
    return (
      <Layout mode={mode} header={header}>
        <p className="text-sm text-[var(--text-muted)]">Loading lesson…</p>
      </Layout>
    )
  }

  // Full lesson available
  if (lesson && !isCustom) {
    if (mode === 'revision') {
      const { blocks, outline } = lessonRevision(lesson)
      return (
        <Layout mode={mode} header={header} rail={<LessonRail meta={meta} outline={outline} outlineTitle="Revision sheet" />}>
          {blocks.length > 0 ? (
            <article className="cd-article">
              <LessonBlocks blocks={blocks} />
            </article>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">This lesson has no revision section yet.</p>
          )}
          {content && !content.generated && (
            <div className="mt-10">
              <TopicBody meta={meta} content={content} mode="quick" overlay={overlay} />
            </div>
          )}
          {footer}
        </Layout>
      )
    }

    const blocks = lesson.focus ? lesson.focus.blocks : lesson.lesson.blocks
    const outline = lesson.focus ? outlineOf(lesson.focus.blocks) : lesson.lesson.outline
    return (
      <Layout mode={mode} header={header} rail={<LessonRail meta={meta} outline={outline} />} outline={outline}>
        {lesson.focus ? (
          <FocusedConcept lesson={lesson} meta={meta} />
        ) : (
          <>
            <Objectives items={lesson.lesson.frontmatter.objectives} />
            <article className="cd-article">
              <LessonBlocks blocks={blocks} />
            </article>
          </>
        )}
        {footer}
        {personalTools}
      </Layout>
    )
  }

  // Condensed notes (no full lesson yet) or a custom topic
  if (!content || (!isCustom && !meta.contentReady)) {
    return (
      <Layout mode={mode} header={header}>
        <div className="rounded-md border border-[var(--border)] bg-[var(--bg-muted)] p-4 text-sm">
          <p className="font-semibold text-[var(--heading)]">Lesson in preparation</p>
          <p className="mt-1 text-[var(--text-muted)]">
            This topic is in the curriculum but has no written lesson yet. Use the related topics and
            your own notes below in the meantime.
          </p>
        </div>
        {footer}
        {personalTools}
      </Layout>
    )
  }

  return (
    <NotesView
      meta={meta}
      mode={mode}
      header={header}
      content={isCustom && custom ? customTopicToContent(custom) : content}
      overlay={overlay}
      isCustom={isCustom}
      footer={footer}
      personalTools={personalTools}
      customControls={
        isCustom && custom ? (
          <>
            <div className="print-hidden flex flex-wrap items-center gap-2" data-screen-only>
              <Badge tone="info">Custom topic</Badge>
              <TrackBadge track={meta.track} />
              <PriorityBadge priority={meta.priority} />
              <button
                type="button"
                className="ml-auto text-xs text-[var(--danger)] hover:underline"
                onClick={() => {
                  if (confirm(`Delete “${meta.title}”?`)) {
                    deleteCustomTopic(meta.id)
                    navigate(`/tracks/${meta.track}`)
                  }
                }}
              >
                Delete topic
              </button>
            </div>
            {mode === 'full' && (
              <CustomTopicBasics
                whatIsIt={custom.whatIsIt ?? ''}
                whyExists={custom.whyExists ?? ''}
                mentalModel={custom.mentalModel ?? ''}
                onSave={(patch) => updateCustomTopic(custom.id, patch)}
              />
            )}
          </>
        ) : null
      }
    />
  )
}

function lessonRevision(resolved: ResolvedLesson): { blocks: MdBlock[]; outline: OutlineItem[] } {
  const blocks = revisionBlocks(resolved.lesson.blocks)
  return { blocks, outline: outlineOf(blocks) }
}

function Layout({
  mode,
  header,
  rail,
  outline,
  children,
}: {
  mode: Mode
  header: ReactNode
  rail?: ReactNode
  outline?: OutlineItem[]
  children: ReactNode
}) {
  const showRail = Boolean(rail) && mode !== 'study'
  return (
    <div className={`mx-auto flex gap-12 px-4 py-8 md:px-8 ${showRail ? 'max-w-[82rem]' : 'max-w-[56rem]'}`}>
      <div className={`min-w-0 flex-1 ${mode === 'study' ? 'mx-auto max-w-[calc(var(--measure)+2rem)]' : ''}`}>
        <div className="space-y-8">
          {header}
          {outline && outline.filter((o) => o.level === 2).length > 2 && (
            <details className={`print-hidden rounded-md border border-[var(--border)] px-3 py-2 ${showRail ? 'xl:hidden' : ''}`} data-screen-only>
              <summary className="cursor-pointer text-sm font-medium text-[var(--text-muted)]">On this page</summary>
              <div className="mt-2">
                <TableOfContents outline={outline} title="" />
              </div>
            </details>
          )}
          <div>{children}</div>
        </div>
      </div>
      {showRail && (
        <aside className="print-hidden hidden w-[var(--rail-width)] shrink-0 xl:block" data-screen-only aria-label="Lesson navigation">
          <div className="cd-scroll sticky top-8 max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 pr-1">{rail}</div>
        </aside>
      )}
    </div>
  )
}

function Objectives({ items }: { items?: string[] }) {
  if (!items?.length) return null
  return (
    <section className="mb-10 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-4" aria-labelledby="objectives-title">
      <h2 id="objectives-title" className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">
        What you will be able to do
      </h2>
      <ul className="mt-2 space-y-1.5 text-[0.95rem] text-[var(--text)]">
        {items.map((o) => (
          <li key={o} className="flex gap-2.5">
            <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <span>{o}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function FocusedConcept({ lesson, meta }: { lesson: ResolvedLesson; meta: TopicMeta }) {
  const parent = getTopicMeta(lesson.lessonId)
  return (
    <>
      <div className="mb-8 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--text-muted)]">
        <strong className="text-[var(--heading)]">{meta.title}</strong> is taught as part of the lesson{' '}
        <Link className="cd-link" to={`/topics/${lesson.lessonId}`}>
          {parent?.title ?? lesson.lessonId}
        </Link>
        . This page shows that section on its own; read the full lesson for the surrounding context.
      </div>
      <article className="cd-article">
        <LessonBlocks blocks={lesson.focus!.blocks} />
      </article>
      <p className="mt-8 text-sm">
        <Link className="cd-link" to={`/topics/${lesson.lessonId}#${lesson.focus!.anchor}`}>
          Read this section inside the full lesson →
        </Link>
      </p>
    </>
  )
}

function LessonFooter({
  meta,
  mode,
  completed,
  onComplete,
  nav,
}: {
  meta: TopicMeta
  mode: Mode
  completed: boolean
  onComplete: () => void
  nav: ReturnType<typeof getTopicNeighbors>
}) {
  const suffix = mode === 'full' ? '' : `/${mode}`
  return (
    <div className="print-hidden mt-14 space-y-4" data-screen-only>
      {mode !== 'revision' && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3">
          <p className="text-sm text-[var(--text-muted)]">
            {completed ? 'You have completed this topic.' : 'Finished reading and tried the exercises?'}
          </p>
          <button
            type="button"
            onClick={onComplete}
            disabled={completed}
            className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] disabled:cursor-default disabled:opacity-60"
          >
            {completed ? 'Completed ✓' : 'Mark as complete'}
          </button>
        </div>
      )}
      <nav aria-label="Previous and next topic" className="grid gap-3 sm:grid-cols-2">
        {nav.prev ? (
          <Link
            to={`/topics/${nav.prev.id}${suffix}`}
            className="rounded-md border border-[var(--border)] px-4 py-3 hover:border-[var(--border-strong)]"
          >
            <div className="text-[11px] uppercase tracking-wider text-[var(--text-faint)]">← Previous</div>
            <div className="mt-0.5 text-sm font-medium text-[var(--heading)]">{nav.prev.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {nav.next && (
          <Link
            to={`/topics/${nav.next.id}${suffix}`}
            className="rounded-md border border-[var(--border)] px-4 py-3 text-right hover:border-[var(--border-strong)]"
          >
            <div className="text-[11px] uppercase tracking-wider text-[var(--text-faint)]">Next →</div>
            <div className="mt-0.5 text-sm font-medium text-[var(--heading)]">{nav.next.title}</div>
          </Link>
        )}
      </nav>
      <p className="text-center text-xs">
        <Link className="text-[var(--text-faint)] hover:text-[var(--accent)]" to={`/tracks/${meta.track}?section=${encodeURIComponent(meta.sectionId)}`}>
          Back to {meta.sectionId} · {meta.sectionTitle}
        </Link>
      </p>
    </div>
  )
}

function NotesView({
  meta,
  mode,
  header,
  content,
  overlay,
  isCustom,
  footer,
  personalTools,
  customControls,
}: {
  meta: TopicMeta
  mode: Mode
  header: ReactNode
  content: TopicContent
  overlay: ReturnType<typeof getOverlay>
  isCustom: boolean
  footer: ReactNode
  personalTools: ReactNode
  customControls: ReactNode
}) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [outline, setOutline] = useState<OutlineItem[]>([])
  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    setOutline(
      Array.from(el.querySelectorAll('h2[id]')).map((h) => ({ id: h.id, level: 2 as const, text: h.textContent ?? '' })),
    )
  }, [content, mode])

  return (
    <Layout mode={mode} header={header} rail={<LessonRail meta={meta} outline={outline} />}>
      {customControls}
      {!isCustom && (
        <p className="print-hidden mb-6 rounded-md border border-dashed border-[var(--border-strong)] px-4 py-3 text-sm text-[var(--text-muted)]" data-screen-only>
          {content.generated
            ? 'These are outline notes generated from the module structure. A full lesson for this topic is being written.'
            : 'These are condensed study notes. A full step-by-step lesson for this topic is being written.'}
        </p>
      )}
      <div ref={bodyRef}>
        <TopicBody meta={meta} content={content} mode={mode === 'revision' ? 'quick' : 'full'} overlay={overlay} />
      </div>
      {footer}
      {personalTools}
    </Layout>
  )
}

function CustomTopicBasics({
  whatIsIt,
  whyExists,
  mentalModel,
  onSave,
}: {
  whatIsIt: string
  whyExists: string
  mentalModel: string
  onSave: (patch: { whatIsIt?: string; whyExists?: string; mentalModel?: string }) => void
}) {
  return (
    <section className="print-hidden my-6 space-y-2 rounded-lg border border-dashed border-[var(--border)] p-3" data-screen-only>
      <h2 className="text-sm font-semibold">Edit basics</h2>
      {(
        [
          ['What is it?', 'whatIsIt', whatIsIt],
          ['Why it exists', 'whyExists', whyExists],
          ['Mental model', 'mentalModel', mentalModel],
        ] as const
      ).map(([label, key, value]) => (
        <label key={key} className="block space-y-1 text-sm">
          <span className="text-xs text-[var(--text-muted)]">{label}</span>
          <textarea
            className="min-h-16 w-full rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5"
            defaultValue={value}
            onBlur={(e) => onSave({ [key]: e.target.value })}
          />
        </label>
      ))}
    </section>
  )
}

function PersonalNotes({ note, onChange }: { note: string; onChange: (v: string) => void }) {
  return (
    <section className="print-hidden" data-screen-only>
      <h2 className="mb-2 text-sm font-semibold text-[var(--heading)]">My notes</h2>
      <textarea
        className="min-h-28 w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-sm"
        value={note}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Personal notes for this topic (saved in this browser)"
      />
    </section>
  )
}
