import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { authErrorMessage, useAuthStore } from '@/stores/auth-store'

type Mode = 'signin' | 'signup' | 'reset'

const inputClass =
  'w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]'

function GoogleMark() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

export function LoginPage() {
  const status = useAuthStore((s) => s.status)
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle)
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail)
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail)
  const sendPasswordReset = useAuthStore((s) => s.sendPasswordReset)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')?.startsWith('/') ? params.get('next')! : '/'

  const [mode, setMode] = useState<Mode>(params.get('mode') === 'signup' ? 'signup' : 'signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    if (status === 'signed_in') navigate(next, { replace: true })
  }, [status, next, navigate])

  function switchMode(m: Mode) {
    setMode(m)
    setError('')
    setInfo('')
  }

  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError('')
    setInfo('')
    try {
      await action()
    } catch (e) {
      setError(authErrorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (mode === 'reset') {
      void run(async () => {
        await sendPasswordReset(email)
        setInfo('If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.')
      })
      return
    }
    if (mode === 'signup' && password.length < 8) {
      setError('Use at least 8 characters for your password.')
      return
    }
    void run(() => (mode === 'signup' ? signUpWithEmail(name, email, password) : signInWithEmail(email, password)))
  }

  if (status === 'disabled') {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-semibold text-[var(--heading)]">Accounts aren’t set up yet</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          This build has no Firebase project configured, so progress is saved in this browser only. Add the{' '}
          <code>VITE_FIREBASE_*</code> values described in <code>docs/AUTH_SETUP.md</code> to enable sign-in and
          cloud sync.
        </p>
        <Link to="/" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    )
  }

  const title =
    mode === 'signup' ? 'Create your account' : mode === 'reset' ? 'Reset your password' : 'Welcome back'
  const subtitle =
    mode === 'signup'
      ? 'Free forever. Your lessons, problem status, notes and revision schedule follow you to every device.'
      : mode === 'reset'
        ? 'Enter your account email and we’ll send you a link to choose a new password.'
        : 'Sign in to pick up exactly where you left off.'

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-10 md:py-16">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-semibold text-[var(--heading)]">{title}</h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">{subtitle}</p>

        {mode !== 'reset' && (
          <>
            <Button
              type="button"
              size="lg"
              className="mt-6 w-full"
              disabled={busy || status === 'loading'}
              onClick={() => void run(signInWithGoogle)}
            >
              <GoogleMark />
              Continue with Google
            </Button>
            <div className="my-5 flex items-center gap-3 text-xs text-[var(--text-faint)]">
              <span className="h-px flex-1 bg-[var(--border)]" />
              or with email
              <span className="h-px flex-1 bg-[var(--border)]" />
            </div>
          </>
        )}

        <form className={`space-y-3 ${mode === 'reset' ? 'mt-6' : ''}`} onSubmit={onSubmit} noValidate>
          {mode === 'signup' && (
            <label className="block space-y-1">
              <span className="text-sm font-medium text-[var(--heading)]">Name</span>
              <input
                className={inputClass}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </label>
          )}
          <label className="block space-y-1">
            <span className="text-sm font-medium text-[var(--heading)]">Email</span>
            <input
              className={inputClass}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          {mode !== 'reset' && (
            <label className="block space-y-1">
              <span className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-[var(--heading)]">Password</span>
                {mode === 'signin' && (
                  <button
                    type="button"
                    className="text-xs text-[var(--accent)] hover:underline"
                    onClick={() => switchMode('reset')}
                  >
                    Forgot password?
                  </button>
                )}
              </span>
              <input
                className={inputClass}
                type="password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
                minLength={mode === 'signup' ? 8 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 8 characters' : ''}
              />
            </label>
          )}

          {error && (
            <p role="alert" className="text-sm text-[var(--danger)]">
              {error}
            </p>
          )}
          {info && <p className="text-sm text-[var(--success)]">{info}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={busy || !email || (mode !== 'reset' && !password)}
          >
            {busy
              ? 'Please wait…'
              : mode === 'signup'
                ? 'Create account'
                : mode === 'reset'
                  ? 'Send reset link'
                  : 'Sign in'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
          {mode === 'signin' && (
            <>
              New here?{' '}
              <button type="button" className="text-[var(--accent)] hover:underline" onClick={() => switchMode('signup')}>
                Create a free account
              </button>
            </>
          )}
          {mode === 'signup' && (
            <>
              Already have an account?{' '}
              <button type="button" className="text-[var(--accent)] hover:underline" onClick={() => switchMode('signin')}>
                Sign in
              </button>
            </>
          )}
          {mode === 'reset' && (
            <button type="button" className="text-[var(--accent)] hover:underline" onClick={() => switchMode('signin')}>
              ← Back to sign in
            </button>
          )}
        </p>
      </div>
      <p className="mt-4 text-center text-xs text-[var(--text-faint)]">
        Progress you made before signing in on this device is merged into your account automatically.
      </p>
    </div>
  )
}
