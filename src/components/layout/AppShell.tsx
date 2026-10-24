import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { GlobalSearch } from './GlobalSearch'
import { Sidebar } from './Sidebar'
import { useUserStore } from '@/stores/user-store'
import { applyAppearance } from '@/lib/appearance'
import { THEMES } from '@/lib/import-export'
import type { ThemeName } from '@/domain/types'

export function AppShell() {
  const theme = useUserStore((s) => s.theme)
  const reading = useUserStore((s) => s.reading)
  const setTheme = useUserStore((s) => s.setTheme)
  const hydrated = useUserStore((s) => s.hydrated)
  const hydrate = useUserStore((s) => s.hydrate)
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isPrintRoute = location.pathname.startsWith('/print/')
  // Topic study/revision views only — not the app's /revision queue page.
  const isFocusedStudy = /\/topics\/[^/]+\/(study|revision)\/?$/.test(
    location.pathname,
  )

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  useEffect(() => {
    applyAppearance(theme, reading)
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyAppearance(theme, reading)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme, reading])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  if (!hydrated) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
        Loading preparation data…
      </div>
    )
  }

  if (isPrintRoute) {
    return (
      <div className="min-h-full bg-white text-black" data-theme="light">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <a
        href="#main-scroll"
        className="sr-only z-50 rounded bg-[var(--accent)] px-3 py-2 text-sm text-[var(--accent-contrast)] focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>
      <div
        className={`print-hidden fixed inset-y-0 left-0 z-40 transform transition-transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isFocusedStudy ? '' : 'md:static md:translate-x-0'}`}
      >
        <Sidebar />
      </div>

      {mobileOpen && (
        <button
          type="button"
          className={`print-hidden fixed inset-0 z-30 bg-black/40 ${isFocusedStudy ? '' : 'md:hidden'}`}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          data-screen-only
          className="print-hidden flex items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 md:px-5"
        >
          <button
            type="button"
            className={`shrink-0 rounded-md border border-[var(--border)] px-2 py-1 text-sm text-[var(--text-muted)] ${isFocusedStudy ? '' : 'md:hidden'}`}
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>
          {isFocusedStudy && (
            <Link
              to="/"
              className="shrink-0 text-sm text-[var(--accent)] hover:underline"
            >
              ← Exit focused mode
            </Link>
          )}
          <GlobalSearch />
          <label className="hidden shrink-0 items-center gap-1.5 text-xs text-[var(--text-faint)] sm:flex">
            <span>Theme</span>
            <select
              className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-1.5 py-1 text-xs text-[var(--text)]"
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeName)}
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id === 'system' ? 'System' : t.label}
                </option>
              ))}
            </select>
          </label>
        </header>
        <main id="main-scroll" tabIndex={-1} className="cd-scroll flex-1 overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
