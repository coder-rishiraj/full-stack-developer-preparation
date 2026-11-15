import { useEffect, useState } from 'react'
import { authErrorMessage, useAuthStore, VERIFY_RESEND_COOLDOWN_S } from '@/stores/auth-store'

const DISMISS_KEY = 'se-prep:verify-banner-dismissed'

function secondsLeft(sentAt: number | null): number {
  if (!sentAt) return 0
  return Math.max(0, VERIFY_RESEND_COOLDOWN_S - Math.floor((Date.now() - sentAt) / 1000))
}

/**
 * Shown to email/password accounts until they confirm their address: says where
 * the signup email went, lets them resend it, and re-checks after they click it.
 */
export function VerifyEmailBanner() {
  const user = useAuthStore((s) => s.user)
  const sentTo = useAuthStore((s) => s.verificationSentTo)
  const sentAt = useAuthStore((s) => s.verificationSentAt)
  const resend = useAuthStore((s) => s.resendVerification)
  const refreshUser = useAuthStore((s) => s.refreshUser)
  const [cooldown, setCooldown] = useState(() => secondsLeft(sentAt))
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    setCooldown(secondsLeft(sentAt))
    if (!sentAt) return
    const id = setInterval(() => {
      const left = secondsLeft(sentAt)
      setCooldown(left)
      if (left === 0) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [sentAt])

  if (!user || user.emailVerified || user.provider !== 'password' || dismissed) return null

  const justSent = sentTo === user.email && sentAt !== null

  async function onResend() {
    setBusy(true)
    setMessage(null)
    try {
      await resend()
      setMessage({ tone: 'ok', text: 'Sent! Check your inbox (and spam folder).' })
    } catch (e) {
      setMessage({ tone: 'error', text: authErrorMessage(e) })
    } finally {
      setBusy(false)
    }
  }

  async function onCheck() {
    setBusy(true)
    setMessage(null)
    await refreshUser()
    setBusy(false)
    if (!useAuthStore.getState().user?.emailVerified) {
      setMessage({ tone: 'error', text: 'Not confirmed yet — click the link in the email first.' })
    }
  }

  return (
    <div
      role="status"
      data-screen-only
      className="print-hidden flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[var(--border)] bg-[var(--accent-soft)] px-3 py-2 text-sm md:px-5"
    >
      <span className="min-w-0 flex-1 text-[var(--text)]">
        {justSent ? (
          <>
            <strong className="font-semibold text-[var(--heading)]">Welcome aboard!</strong> We’ve emailed a confirmation
            link to <strong className="font-medium">{user.email}</strong>. Check your inbox (and spam folder).
          </>
        ) : (
          <>
            Please confirm your email address <strong className="font-medium">{user.email}</strong> using the link we
            sent you.
          </>
        )}
        {message && (
          <span className={`ml-2 ${message.tone === 'ok' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {message.text}
          </span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={() => void onCheck()}
          disabled={busy}
          className="font-medium text-[var(--accent)] hover:underline disabled:opacity-50"
        >
          I’ve confirmed
        </button>
        <button
          type="button"
          onClick={() => void onResend()}
          disabled={busy || cooldown > 0}
          className="font-medium text-[var(--accent)] hover:underline disabled:opacity-50 disabled:no-underline"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
        </button>
        <button
          type="button"
          aria-label="Hide for now"
          onClick={() => {
            setDismissed(true)
            try {
              sessionStorage.setItem(DISMISS_KEY, '1')
            } catch {
              /* ignore */
            }
          }}
          className="text-[var(--text-faint)] hover:text-[var(--text)]"
        >
          ✕
        </button>
      </span>
    </div>
  )
}
