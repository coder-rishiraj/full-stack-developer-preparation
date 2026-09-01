import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useUserStore } from '@/stores/user-store'

function applyTheme(theme: 'light' | 'dark' | 'system') {
  const root = document.documentElement
  const dark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  root.classList.toggle('dark', dark)
}

export function AppShell() {
  const theme = useUserStore((s) => s.theme)
  const hydrated = useUserStore((s) => s.hydrated)
  const hydrate = useUserStore((s) => s.hydrate)
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isPrintRoute = location.pathname.startsWith('/print/')
  const isStudy = location.pathname.includes('/study') || location.pathname.includes('/revision')

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

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
      <div className="min-h-full bg-white text-black">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <div
        className={`print-hidden fixed inset-y-0 left-0 z-40 transform transition-transform md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isStudy ? 'md:hidden' : ''}`}
      >
        <Sidebar />
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="print-hidden fixed inset-0 z-30 bg-black/40 md:hidden"
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
            className="rounded-md border border-[var(--border)] px-2 py-1 text-sm md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            Menu
          </button>
          {isStudy && (
            <Link to="/" className="text-sm text-[var(--accent)] hover:underline">
              ← Exit focused mode
            </Link>
          )}
          <div className="ml-auto text-xs text-[var(--text-faint)]">
            Desktop-first study · A4 print ready
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
