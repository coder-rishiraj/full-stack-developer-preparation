import { useState } from 'react'
import { OVERLAY_FIELDS } from '@/domain/user-content'
import type { OverlayListField, TopicOverlay } from '@/domain/types'

export function ExtraPointsEditor({
  overlay,
  onAdd,
  onUpdate,
  onRemove,
}: {
  overlay: TopicOverlay
  onAdd: (field: OverlayListField, text: string) => void
  onUpdate: (field: OverlayListField, index: number, text: string) => void
  onRemove: (field: OverlayListField, index: number) => void
}) {
  const [field, setField] = useState<OverlayListField>('extraPoints')
  const [draft, setDraft] = useState('')

  function submit() {
    const text = draft.trim()
    if (!text) return
    onAdd(field, text)
    setDraft('')
  }

  return (
    <section
      className="print-hidden space-y-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
      data-screen-only
    >
      <div>
        <h2 className="text-sm font-semibold">Your additions</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Extra points are saved locally and layered on top of curriculum notes. They export with
          your backup JSON.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-sm"
          value={field}
          onChange={(e) => setField(e.target.value as OverlayListField)}
          aria-label="Section for new point"
        >
          {OVERLAY_FIELDS.map((f) => (
            <option key={f.field} value={f.field}>
              {f.label}
            </option>
          ))}
        </select>
        <input
          className="min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-sm"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Add a point…"
          aria-label="New point text"
        />
        <button
          type="button"
          className="rounded bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white"
          onClick={submit}
        >
          Add
        </button>
      </div>

      <div className="space-y-3">
        {OVERLAY_FIELDS.map(({ field: f, label }) => {
          const items = overlay[f] ?? []
          if (items.length === 0) return null
          return (
            <div key={f}>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                {label}
              </h3>
              <ul className="space-y-1.5">
                {items.map((item, index) => (
                  <li key={`${f}-${index}`} className="flex gap-2">
                    <input
                      className="min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm"
                      value={item}
                      onChange={(e) => onUpdate(f, index, e.target.value)}
                      aria-label={`Edit ${label} point ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="shrink-0 rounded border border-[var(--border)] px-2 py-1 text-xs text-[var(--danger)]"
                      onClick={() => onRemove(f, index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/** Read-only list of user points for print / inline display. */
export function UserPointsList({
  items,
  label = 'Yours',
}: {
  items: string[]
  label?: string
}) {
  if (!items.length) return null
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item} className="text-[var(--text)]">
          <span className="mr-1.5 rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
            {label}
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}
