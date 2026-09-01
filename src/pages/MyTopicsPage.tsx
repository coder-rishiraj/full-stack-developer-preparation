import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TRACKS } from '@/content/taxonomy'
import { listCustomTopicsFromMap } from '@/domain/user-content'
import type { ExecutionPriority, Priority, TrackId } from '@/domain/types'
import {
  ExecutionPriorityBadge,
  PriorityBadge,
  TrackBadge,
} from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useUserStore } from '@/stores/user-store'

export function MyTopicsPage() {
  const navigate = useNavigate()
  const customTopicsMap = useUserStore((s) => s.customTopics)
  const addCustomTopic = useUserStore((s) => s.addCustomTopic)
  const deleteCustomTopic = useUserStore((s) => s.deleteCustomTopic)
  const customTopics = useMemo(
    () => listCustomTopicsFromMap(customTopicsMap),
    [customTopicsMap],
  )

  const [title, setTitle] = useState('')
  const [track, setTrack] = useState<TrackId>('A')
  const [priority, setPriority] = useState<Priority>('tier2')
  const [executionPriority, setExecutionPriority] =
    useState<ExecutionPriority>('p2')
  const [sectionTitle, setSectionTitle] = useState('My Topics')
  const [whatIsIt, setWhatIsIt] = useState('')
  const [takeaways, setTakeaways] = useState('')
  const [revision, setRevision] = useState('')
  const [error, setError] = useState('')

  const formValid = title.trim().length > 0

  function onCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!formValid) {
      setError('Title is required.')
      return
    }
    const topic = addCustomTopic({
      title,
      track,
      priority,
      executionPriority,
      sectionTitle,
      whatIsIt,
      keyTakeaways: takeaways
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      quickRevision: revision
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    setTitle('')
    setWhatIsIt('')
    setTakeaways('')
    setRevision('')
    setError('')
    navigate(`/topics/${topic.id}`)
  }

  const byTrack = useMemo(() => {
    const map = new Map<TrackId, typeof customTopics>()
    for (const t of customTopics) {
      const list = map.get(t.track) ?? []
      list.push(t)
      map.set(t.track, list)
    }
    return map
  }, [customTopics])

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold">My Topics</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Create personal topics that sit alongside the curriculum. They persist in IndexedDB and
          export with your backup.
        </p>
      </div>

      <form
        onSubmit={onCreate}
        className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
      >
        <h2 className="font-semibold">New custom topic</h2>
        <label className="block space-y-1 text-sm">
          <span className="text-[var(--text-muted)]">Title</span>
          <input
            className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Company X interview notes"
            required
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Track</span>
            <select
              className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5"
              value={track}
              onChange={(e) => setTrack(e.target.value as TrackId)}
            >
              {TRACKS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} — {t.shortName}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Knowledge tier</span>
            <select
              className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="tier1">Tier 1</option>
              <option value="tier2">Tier 2</option>
              <option value="tier3">Tier 3</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Execution priority</span>
            <select
              className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5"
              value={executionPriority}
              onChange={(e) =>
                setExecutionPriority(e.target.value as ExecutionPriority)
              }
            >
              <option value="p0">P0 · Do now</option>
              <option value="p1">P1 · Do next</option>
              <option value="p2">P2 · Depth / polish</option>
              <option value="later">Later · Defer</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Section label</span>
            <input
              className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
            />
          </label>
        </div>
        <label className="block space-y-1 text-sm">
          <span className="text-[var(--text-muted)]">What is it?</span>
          <textarea
            className="min-h-20 w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5"
            value={whatIsIt}
            onChange={(e) => setWhatIsIt(e.target.value)}
            placeholder="Short definition…"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-[var(--text-muted)]">Key takeaways (one per line)</span>
          <textarea
            className="min-h-20 w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5"
            value={takeaways}
            onChange={(e) => setTakeaways(e.target.value)}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-[var(--text-muted)]">Quick revision (one per line)</span>
          <textarea
            className="min-h-20 w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5"
            value={revision}
            onChange={(e) => setRevision(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <Button type="submit" variant="primary" disabled={!formValid}>
          Create topic
        </Button>
      </form>

      <section className="space-y-4">
        <h2 className="font-semibold">
          Your topics {customTopics.length ? `(${customTopics.length})` : ''}
        </h2>
        {customTopics.length === 0 ? (
          <p className="text-sm text-[var(--text-faint)]">No custom topics yet.</p>
        ) : (
          TRACKS.filter((t) => byTrack.has(t.id)).map((trackInfo) => (
            <div key={trackInfo.id}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                Track {trackInfo.id}
              </h3>
              <ul className="space-y-2">
                {(byTrack.get(trackInfo.id) ?? []).map((t) => (
                  <li
                    key={t.id}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2"
                  >
                    <Link
                      to={`/topics/${t.id}`}
                      className="font-medium text-[var(--accent)] hover:underline"
                    >
                      {t.title}
                    </Link>
                    <TrackBadge track={t.track} />
                    <PriorityBadge priority={t.priority} />
                    <ExecutionPriorityBadge priority={t.executionPriority} />
                    <button
                      type="button"
                      className="ml-auto text-xs text-[var(--danger)] hover:underline"
                      onClick={() => {
                        if (confirm(`Delete “${t.title}”?`)) deleteCustomTopic(t.id)
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
