import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/layout/AccountMenu'
import { authErrorMessage, useAuthStore } from '@/stores/auth-store'

function formatTime(ms: number | null): string {
  if (!ms) return 'not yet'
  return new Date(ms).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

/** Settings → Account: who is signed in, sync health, and sign-in entry points. */
export function AccountSettings() {
  const status = useAuthStore((s) => s.status)
  const user = useAuthStore((s) => s.user)
  const syncStatus = useAuthStore((s) => s.syncStatus)
  const syncError = useAuthStore((s) => s.syncError)
  const lastSyncedAt = useAuthStore((s) => s.lastSyncedAt)
  const syncNow = useAuthStore((s) => s.syncNow)
  const signOut = useAuthStore((s) => s.signOut)
  const resendVerification = useAuthStore((s) => s.resendVerification)
  const [note, setNote] = useState('')

  if (status === 'disabled') {
    return (
      <section id="account" className="space-y-2">
        <h2 className="font-semibold text-[var(--heading)]">Account</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Cloud accounts are not configured for this build, so progress is saved in this browser only. Use Export
          JSON below to back it up.
        </p>
      </section>
    )
  }

  if (status !== 'signed_in' || !user) {
    return (
      <section id="account" className="space-y-3">
        <h2 className="font-semibold text-[var(--heading)]">Account</h2>
        <p className="text-sm text-[var(--text-muted)]">
          You’re using the site as a guest — progress is saved in this browser only. Sign in to save lessons,
          problem status, notes and revision schedules to your account and use them on any device.
        </p>
        <div className="flex gap-2">
          <Link
            to="/login?next=/settings"
            className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-[var(--accent-contrast)] hover:opacity-90"
          >
            Sign in
          </Link>
          <Link
            to="/login?mode=signup&next=/settings"
            className="rounded-md border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-1.5 text-sm font-medium text-[var(--text)]"
          >
            Create free account
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section id="account" className="space-y-3">
      <h2 className="font-semibold text-[var(--heading)]">Account</h2>
      <div className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
        <Avatar size={40} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-[var(--heading)]">
            {user.displayName || user.email?.split('@')[0]}
          </div>
          <div className="truncate text-xs text-[var(--text-muted)]">
            {user.email} · {user.provider === 'google.com' ? 'Google' : 'Email & password'}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>

      {user.provider === 'password' && !user.emailVerified && (
        <p className="text-xs text-[var(--text-muted)]">
          Email not verified yet.{' '}
          <button
            type="button"
            className="text-[var(--accent)] hover:underline"
            onClick={() =>
              void resendVerification()
                .then(() => setNote('Verification email sent.'))
                .catch((e) => setNote(authErrorMessage(e)))
            }
          >
            Resend verification email
          </button>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-[var(--text-muted)]">
          Cloud sync:{' '}
          <span className="font-medium text-[var(--heading)]">
            {syncStatus === 'synced'
              ? 'up to date'
              : syncStatus === 'syncing'
                ? 'saving…'
                : syncStatus === 'offline'
                  ? 'offline (changes are kept and sent when you reconnect)'
                  : syncStatus === 'error'
                    ? 'failed'
                    : 'idle'}
          </span>{' '}
          · last saved {formatTime(lastSyncedAt)}
        </span>
        <Button size="sm" onClick={() => void syncNow()}>
          Sync now
        </Button>
      </div>
      {syncError && <p className="text-xs text-[var(--danger)]">{syncError}</p>}
      {note && <p className="text-xs text-[var(--success)]">{note}</p>}
      <p className="text-xs text-[var(--text-faint)]">
        Everything below — theme, reading preferences, topic progress, DSA status, notes, bookmarks and custom
        topics — is saved to your account automatically.
      </p>
    </section>
  )
}
