import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import {
  createCustomSectionId,
  defaultCustomSectionId,
} from '@/domain/user-content'
import type { Priority, TrackId } from '@/domain/types'
import { useUserStore } from '@/stores/user-store'

type AddMode = 'topic' | 'section'

type Props = {
  trackId: TrackId
  mode?: AddMode
  /** Existing curriculum or custom section to attach a topic to. */
  sectionId?: string
  sectionTitle?: string
  label: string
  className?: string
  onCreated?: (topicId: string, sectionId: string) => void
}

export function AddCustomTopicControl({
  trackId,
  mode = 'topic',
  sectionId,
  sectionTitle,
  label,
  className = '',
  onCreated,
}: Props) {
  const navigate = useNavigate()
  const addCustomTopic = useUserStore((s) => s.addCustomTopic)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('tier2')
  const [error, setError] = useState('')

  function reset() {
    setTitle('')
    setNewSectionTitle('')
    setPriority('tier2')
    setError('')
    setOpen(false)
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const topicTitle = title.trim()
    if (!topicTitle) {
      setError('Topic title is required.')
      return
    }

    if (mode === 'section') {
      const sectionName = newSectionTitle.trim()
      if (!sectionName) {
        setError('Section name is required.')
        return
      }
      const customSectionId = createCustomSectionId(trackId, sectionName)
      const topic = addCustomTopic({
        title: topicTitle,
        track: trackId,
        sectionId: customSectionId,
        sectionTitle: sectionName,
        priority,
      })
      onCreated?.(topic.id, customSectionId)
      reset()
      navigate(`/topics/${topic.id}`)
      return
    }

    const resolvedSectionId =
      sectionId?.trim() || defaultCustomSectionId(trackId)
    const resolvedSectionTitle = sectionTitle?.trim() || 'My Topics'
    const topic = addCustomTopic({
      title: topicTitle,
      track: trackId,
      sectionId: resolvedSectionId,
      sectionTitle: resolvedSectionTitle,
      priority,
    })
    onCreated?.(topic.id, resolvedSectionId)
    reset()
    navigate(`/topics/${topic.id}`)
  }

  if (!open) {
    return (
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className={`text-[var(--accent)] ${className}`}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setOpen(true)
        }}
      >
        + {label}
      </Button>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      onClick={(event) => event.stopPropagation()}
      className={`space-y-2 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-3 ${className}`}
    >
      {mode === 'section' && (
        <label className="block space-y-1 text-sm">
          <span className="text-[var(--text-muted)]">Section name</span>
          <input
            autoFocus
            className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5"
            value={newSectionTitle}
            onChange={(event) => setNewSectionTitle(event.target.value)}
            placeholder="e.g. Company X interview notes"
          />
        </label>
      )}
      <label className="block space-y-1 text-sm">
        <span className="text-[var(--text-muted)]">Topic title</span>
        <input
          autoFocus={mode === 'topic'}
          className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Auth deep dive"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-[var(--text-muted)]">Knowledge tier</span>
        <select
          className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5"
          value={priority}
          onChange={(event) => setPriority(event.target.value as Priority)}
        >
          <option value="tier1">Tier 1</option>
          <option value="tier2">Tier 2</option>
          <option value="tier3">Tier 3</option>
        </select>
      </label>
      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" variant="primary">
          {mode === 'section' ? 'Create section' : 'Add topic'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={reset}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
