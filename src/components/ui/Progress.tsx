export function ProgressBar({
  value,
  label,
  accent,
}: {
  value: number
  label?: string
  accent?: string
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]">
          <span>{label}</span>
          <span className="font-mono">{pct}%</span>
        </div>
      )}
      <div
        className="h-2 overflow-hidden rounded-full bg-[var(--bg-muted)]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{
            width: `${pct}%`,
            background: accent ?? 'var(--accent)',
          }}
        />
      </div>
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-[var(--text-muted)]">{hint}</div>}
    </div>
  )
}
