import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useUserStore } from '@/stores/user-store'

export function SettingsPage() {
  const theme = useUserStore((s) => s.theme)
  const setTheme = useUserStore((s) => s.setTheme)
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
    <div className="mx-auto max-w-xl space-y-6 px-4 py-6 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Theme and portable backups of personal progress.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="font-semibold">Appearance</h2>
        <select
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-sm"
          value={theme}
          onChange={(e) => setTheme(e.target.value as typeof theme)}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <p className="text-xs text-[var(--text-faint)]">Print always uses a light handbook theme.</p>
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
