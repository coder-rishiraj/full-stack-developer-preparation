import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getTopicNeighbors } from '@/content/taxonomy'
import { TopicHeader } from '@/components/topic/TopicHeader'
import { TopicBody } from '@/components/topic/TopicBody'
import { ExtraPointsEditor } from '@/components/topic/ExtraPointsEditor'
import { RevisionScheduleCard } from '@/components/topic/RevisionScheduleCard'
import { getTopicProgress } from '@/domain/progress-selectors'
import {
  customTopicToContent,
  getCustomTopic,
  getOverlay,
  isCustomTopicId,
  resolveTopicMeta,
} from '@/domain/user-content'
import { useUserStore } from '@/stores/user-store'
import type { Confidence, StudyStatus } from '@/domain/types'
import { PriorityBadge, TrackBadge, Badge } from '@/components/ui/Badge'
import { useTopicContent } from '@/hooks/useTopicContent'

export function TopicPage({ mode = 'full' }: { mode?: 'full' | 'study' | 'revision' }) {
  const { topicId = '' } = useParams()
  const navigate = useNavigate()
  const state = useUserStore()
  const meta = resolveTopicMeta(state, topicId)
  const custom = getCustomTopic(state, topicId)
  const isCustom = isCustomTopicId(topicId) && !!custom

  const { content: curriculumContent, loading } = useTopicContent(
    isCustom ? undefined : topicId,
  )
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
  const note = topicId ? (state.notes[topicId] ?? '') : ''

  const progress = getTopicProgress(state, topicId)
  const bookmarked = topicId ? state.bookmarks.includes(topicId) : false
  const nav = useMemo(
    () => (isCustom ? {} : getTopicNeighbors(topicId)),
    [topicId, isCustom],
  )

  if (!meta) {
    return (
      <div className="p-6">
        <p>Topic not found.</p>
        <Link to="/">Back to dashboard</Link>
      </div>
    )
  }

  const maxWidth = mode === 'full' ? 'max-w-[var(--content-max)]' : 'max-w-[var(--study-max)]'
  const bodyMode = mode === 'revision' ? 'quick' : 'full'
  const scheduleCard = (
    <RevisionScheduleCard
      progress={progress}
      onRevise={() => markTopicRevised(meta.id)}
      onReschedule={() => rescheduleTopic(meta.id)}
    />
  )

  if (!isCustom && loading && meta.contentReady) {
    return (
      <div className={`mx-auto ${maxWidth} space-y-6 px-4 py-6 md:px-6`}>
        <TopicHeader
          meta={meta}
          progress={progress}
          mode={mode}
          bookmarked={bookmarked}
          onStatus={(s: StudyStatus) => setTopicStatus(meta.id, s)}
          onConfidence={(c: Confidence) => setTopicConfidence(meta.id, c)}
          onRevise={() => markTopicRevised(meta.id)}
          onToggleBookmark={() => toggleBookmark(meta.id)}
        />
        {scheduleCard}
        <p className="text-sm text-[var(--text-muted)]">Loading deep notes…</p>
      </div>
    )
  }

  if (!content || (!isCustom && !meta.contentReady)) {
    return (
      <div className={`mx-auto ${maxWidth} space-y-6 px-4 py-6 md:px-6`}>
        <TopicHeader
          meta={meta}
          progress={progress}
          mode={mode}
          bookmarked={bookmarked}
          onStatus={(s: StudyStatus) => setTopicStatus(meta.id, s)}
          onConfidence={(c: Confidence) => setTopicConfidence(meta.id, c)}
          onRevise={() => markTopicRevised(meta.id)}
          onToggleBookmark={() => toggleBookmark(meta.id)}
        />
        {scheduleCard}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] p-4 text-sm">
          <p className="font-semibold">Curriculum placeholder</p>
          <p className="mt-1 text-[var(--text-muted)]">
            Metadata is in the curriculum hierarchy. Deep notes for this topic are not written yet.
          </p>
        </div>
        <ExtraPointsEditor
          overlay={overlay}
          onAdd={(field, text) => addOverlayPoint(meta.id, field, text)}
          onUpdate={(field, index, text) => updateOverlayPoint(meta.id, field, index, text)}
          onRemove={(field, index) => removeOverlayPoint(meta.id, field, index)}
        />
        <PersonalNotes note={note} onChange={(v) => setNote(meta.id, v)} />
      </div>
    )
  }

  return (
    <div className={`mx-auto ${maxWidth} space-y-6 px-4 py-6 md:px-6`}>
      <TopicHeader
        meta={meta}
        progress={progress}
        mode={mode}
        bookmarked={bookmarked}
        onStatus={(s: StudyStatus) => setTopicStatus(meta.id, s)}
        onConfidence={(c: Confidence) => setTopicConfidence(meta.id, c)}
        onRevise={() => markTopicRevised(meta.id)}
        onToggleBookmark={() => toggleBookmark(meta.id)}
      />

      {scheduleCard}

      {isCustom && (
        <div className="print-hidden flex flex-wrap items-center gap-2" data-screen-only>
          <Badge tone="info">Custom topic</Badge>
          <TrackBadge track={meta.track} />
          <PriorityBadge priority={meta.priority} />
          <Link
            className="text-xs text-[var(--accent)] hover:underline"
            to={`/tracks/${meta.track}?section=${encodeURIComponent(meta.sectionId)}`}
          >
            Back to track section
          </Link>
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
      )}

      {isCustom && custom && mode === 'full' && (
        <CustomTopicBasics
          whatIsIt={custom.whatIsIt ?? ''}
          whyExists={custom.whyExists ?? ''}
          mentalModel={custom.mentalModel ?? ''}
          onSave={(patch) => updateCustomTopic(custom.id, patch)}
        />
      )}

      {mode !== 'full' && (
        <div
          className="print-hidden flex flex-wrap gap-2 border-b border-[var(--border)] pb-3"
          data-screen-only
        >
          <TopicNav nav={nav} mode={mode} inline />
        </div>
      )}

      <TopicBody
        meta={meta}
        content={
          isCustom && custom
            ? customTopicToContent(custom)
            : content
        }
        mode={bodyMode}
        overlay={overlay}
      />

      <ExtraPointsEditor
        overlay={overlay}
        onAdd={(field, text) => addOverlayPoint(meta.id, field, text)}
        onUpdate={(field, index, text) => updateOverlayPoint(meta.id, field, index, text)}
        onRemove={(field, index) => removeOverlayPoint(meta.id, field, index)}
      />

      <PersonalNotes note={note} onChange={(v) => setNote(meta.id, v)} />

      {mode === 'full' && !isCustom && <TopicNav nav={nav} mode={mode} />}
    </div>
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
  onSave: (patch: {
    whatIsIt?: string
    whyExists?: string
    mentalModel?: string
  }) => void
}) {
  return (
    <section
      className="print-hidden space-y-2 rounded-lg border border-dashed border-[var(--border)] p-3"
      data-screen-only
    >
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

function PersonalNotes({
  note,
  onChange,
}: {
  note: string
  onChange: (v: string) => void
}) {
  return (
    <section className="print-hidden border-t border-[var(--border)] pt-4" data-screen-only>
      <h2 className="mb-2 text-sm font-semibold">My Notes</h2>
      <textarea
        className="min-h-28 w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-sm"
        value={note}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Freeform personal notes (saved locally)"
      />
    </section>
  )
}

function TopicNav({
  nav,
  mode,
  inline,
}: {
  nav: ReturnType<typeof getTopicNeighbors>
  mode: 'full' | 'study' | 'revision'
  inline?: boolean
}) {
  const suffix = mode === 'full' ? '' : `/${mode}`
  if (!nav.prev && !nav.next) return null
  return (
    <div
      className={`print-hidden flex flex-wrap gap-3 text-xs ${inline ? '' : 'border-t border-[var(--border)] pt-3'}`}
      data-screen-only
    >
      {nav.prev && (
        <Link className="text-[var(--accent)] hover:underline" to={`/topics/${nav.prev.id}${suffix}`}>
          ← {nav.prev.title}
        </Link>
      )}
      {nav.next && (
        <Link
          className="ml-auto text-[var(--accent)] hover:underline"
          to={`/topics/${nav.next.id}${suffix}`}
        >
          {nav.next.title} →
        </Link>
      )}
    </div>
  )
}
