import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useUserStore } from '@/stores/user-store'
import { THEMES } from '@/lib/import-export'
import type { ReadingPrefs } from '@/domain/types'

function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="text-sm font-medium text-[var(--heading)]">{label}</legend>
      <div className="inline-flex rounded-md bg-[var(--bg-muted)] p-0.5">
        {options.map((o) => (
          <label
            key={o.value}
            className={`cursor-pointer rounded px-3 py-1 text-sm ${
              value === o.value ? 'bg-[var(--bg-elevated)] font-medium text-[var(--heading)] shadow-sm' : 'text-[var(--text-muted)]'
            }`}
          >
            <input type="radio" className="sr-only" checked={value === o.value} onChange={() => onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function SettingsPage() {
  const theme = useUserStore((s) => s.theme)
  const setTheme = useUserStore((s) => s.setTheme)
  const reading = useUserStore((s) => s.reading)
  const setReading = useUserStore((s) => s.setReading)
  const learning = useUserStore((s) => s.learning)
  const setLearning = useUserStore((s) => s.setLearning)
  const interviewDate = useUserStore((s) => s.interviewDate)
  const setInterviewDate = useUserStore((s) => s.setInterviewDate)
  const exportJson = useUserStore((s) => s.exportJson)
  const importJson = useUserStore((s) => s.importJson)
  const resetAll = useUserStore((s) => s.resetAll)
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')

  function downloadExport() {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `se-prep-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage('Exported progress JSON.')
  }

  async function onImportFile(file: File) {
    try {
      const text = await file.text()
      importJson(text)
      setMessage('Import successful.')
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Import failed')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Appearance, reading and learning preferences, and portable backups of your progress.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold text-[var(--heading)]">Theme</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              aria-pressed={theme === t.id}
              data-theme={t.id === 'system' ? undefined : t.id}
              className={`rounded-md border p-3 text-left ${
                theme === t.id ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]' : 'border-[var(--border)]'
              } bg-[var(--bg)]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--heading)]">{t.label}</span>
                {theme === t.id && <span className="text-xs text-[var(--accent)]">Active</span>}
              </div>
              <div className="mt-2 rounded border border-[var(--border)] bg-[var(--bg-elevated)] p-2">
                <div className="h-1.5 w-2/3 rounded bg-[var(--heading)] opacity-80" />
                <div className="mt-1.5 h-1 w-full rounded bg-[var(--text-muted)] opacity-50" />
                <div className="mt-1 h-1 w-5/6 rounded bg-[var(--text-muted)] opacity-50" />
                <div className="mt-2 flex gap-1">
                  <span className="h-2 w-6 rounded bg-[var(--accent)]" />
                  <span className="h-2 w-6 rounded bg-[var(--code-keyword)]" />
                  <span className="h-2 w-6 rounded bg-[var(--code-string)]" />
                  <span className="h-2 w-6 rounded bg-[var(--code-function)]" />
                </div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--text-faint)]">Printing always uses a light, ink-friendly palette.</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-[var(--heading)]">Reading</h2>
        <Choice<ReadingPrefs['font']>
          label="Lesson typeface"
          value={reading.font}
          onChange={(font) => setReading({ font })}
          options={[
            { value: 'serif', label: 'Serif' },
            { value: 'sans', label: 'Sans-serif' },
          ]}
        />
        <Choice<ReadingPrefs['size']>
          label="Text size"
          value={reading.size}
          onChange={(size) => setReading({ size })}
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ]}
        />
        <Choice<ReadingPrefs['measure']>
          label="Line length"
          value={reading.measure}
          onChange={(measure) => setReading({ measure })}
          options={[
            { value: 'narrow', label: 'Narrow' },
            { value: 'normal', label: 'Comfortable' },
            { value: 'wide', label: 'Wide' },
          ]}
        />
        <p className="prose-content rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-[var(--text)]" style={{ maxWidth: 'var(--measure)' }}>
          Binary search works because sorted order lets one comparison rule out a whole half of the remaining candidates.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-[var(--heading)]">Learning</h2>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={learning.autoMarkLearning}
            onChange={(e) => setLearning({ autoMarkLearning: e.target.checked })}
          />
          <span>
            <span className="font-medium text-[var(--heading)]">Track lessons I open</span>
            <span className="block text-[var(--text-muted)]">
              Opening a lesson marks a not-started topic as “Learning” so it appears under Continue learning.
              No revision is scheduled until you mark it complete.
            </span>
          </span>
        </label>
        <Choice<'full' | 'study'>
          label="Open topics in"
          value={learning.defaultView}
          onChange={(defaultView) => setLearning({ defaultView })}
          options={[
            { value: 'full', label: 'Lesson view' },
            { value: 'study', label: 'Focused study view' },
          ]}
        />
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Interview date</h2>
        <input
          type="date"
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={interviewDate ?? ''}
          onChange={(e) => setInterviewDate(e.target.value || undefined)}
        />
        <p className="text-xs text-[var(--text-muted)]">
          Fills Rev 8 (Sunday before interview) on every studied topic’s revision
          calendar.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Import / Export</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={downloadExport}>
            Export JSON
          </Button>
          <Button onClick={() => fileRef.current?.click()}>Import JSON</Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void onImportFile(f)
            }}
          />
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Exports progress, DSA status, revision schedules, notes, bookmarks, extra points, and custom
          topics — not the shipped curriculum files.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Danger zone</h2>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm('Reset all personal progress?')) void resetAll()
          }}
        >
          Reset all progress
        </Button>
      </section>

      {message && <p className="text-sm text-[var(--success)]">{message}</p>}
    </div>
  )
}
