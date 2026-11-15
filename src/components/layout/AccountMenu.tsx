import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore, type SyncStatus } from '@/stores/auth-store'

const SYNC_LABEL: Record<SyncStatus, string> = {
  idle: 'Not synced',
  syncing: 'Saving…',
  synced: 'All progress saved',
  offline: 'Offline — will sync when back online',
  error: 'Sync failed',
}

const SYNC_DOT: Record<SyncStatus, string> = {
  idle: 'bg-[var(--text-faint)]',
  syncing: 'bg-[var(--warning)] animate-pulse',
  synced: 'bg-[var(--success)]',
  offline: 'bg-[var(--warning)]',
  error: 'bg-[var(--danger)]',
}

function initials(name: string | null, email: string | null): string {
  const source = name?.trim() || email?.split('@')[0] || '?'
  const parts = source.split(/[\s._-]+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')).toUpperCase()
}

export function Avatar({ size = 28 }: { size?: number }) {
  const user = useAuthStore((s) => s.user)
  const [broken, setBroken] = useState(false)
  if (!user) return null
  if (user.photoURL && !broken) {
    return (
      <img
        src={user.photoURL}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className="shrink-0 rounded-full"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[11px] font-semibold text-[var(--accent-contrast)]"
      style={{ width: size, height: size }}
    >
      {initials(user.displayName, user.email)}
    </span>
  )
}

export function AccountMenu() {
  const status = useAuthStore((s) => s.status)
  const user = useAuthStore((s) => s.user)
  const syncStatus = useAuthStore((s) => s.syncStatus)
  const syncError = useAuthStore((s) => s.syncError)
  const signOut = useAuthStore((s) => s.signOut)
  const syncNow = useAuthStore((s) => s.syncNow)
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (status === 'disabled') return null
  if (status === 'loading') {
    return <span className="h-7 w-16 shrink-0 animate-pulse rounded-md bg-[var(--bg-muted)]" aria-hidden />
  }

  if (status === 'signed_out' || !user) {
    const next = encodeURIComponent(location.pathname + location.search)
    return (
      <div className="flex shrink-0 items-center gap-2">
        <Link
          to={`/login?next=${next}`}
          className="rounded-md px-2.5 py-1 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
        >
          Sign in
        </Link>
        <Link
          to={`/login?mode=signup&next=${next}`}
          className="hidden rounded-md bg-[var(--accent)] px-2.5 py-1 text-sm font-medium text-[var(--accent-contrast)] hover:opacity-90 sm:inline-block"
        >
          Sign up
        </Link>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu — ${SYNC_LABEL[syncStatus]}`}
        className="relative flex items-center rounded-full ring-offset-2 ring-offset-[var(--bg-elevated)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <Avatar />
        <span
          aria-hidden
          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-elevated)] ${SYNC_DOT[syncStatus]}`}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-1.5 shadow-lg"
        >
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <Avatar size={36} />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-[var(--heading)]">
                {user.displayName || user.email?.split('@')[0]}
              </div>
              <div className="truncate text-xs text-[var(--text-faint)]">{user.email}</div>
            </div>
          </div>
          <div className="mx-2.5 mb-1.5 flex items-center gap-2 rounded-md bg-[var(--bg-muted)] px-2 py-1.5 text-xs text-[var(--text-muted)]">
            <span className={`h-2 w-2 shrink-0 rounded-full ${SYNC_DOT[syncStatus]}`} aria-hidden />
            <span className="flex-1">{SYNC_LABEL[syncStatus]}</span>
            {(syncStatus === 'error' || syncStatus === 'offline') && (
              <button type="button" className="text-[var(--accent)] hover:underline" onClick={() => void syncNow()}>
                Retry
              </button>
            )}
          </div>
          {syncError && <p className="mx-2.5 mb-1.5 text-xs text-[var(--danger)]">{syncError}</p>}
          <div className="my-1 h-px bg-[var(--border)]" />
          <Link
            role="menuitem"
            to="/settings#account"
            className="block rounded-md px-2.5 py-1.5 text-sm text-[var(--text)] hover:bg-[var(--bg-muted)]"
          >
            Account &amp; settings
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={() => void signOut()}
            className="block w-full rounded-md px-2.5 py-1.5 text-left text-sm text-[var(--text)] hover:bg-[var(--bg-muted)]"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
